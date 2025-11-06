<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    // 发布帖子
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'group_id' => 'required|exists:groups,id',
            'content' => 'required|string|max:2000',
            'type' => 'nullable|integer|in:0,1,2',
            'images' => 'nullable|array|max:9',
            'images.*' => 'string|max:500',
            'link_url' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $group = \App\Models\Group::find($request->group_id);
        
        // 检查群组是否存在且正常
        if (!$group || $group->status !== 1) {
            return $this->error('群组不存在或已禁用');
        }

        // 检查是否是群组成员
        if (!$group->hasMember($request->user()->id)) {
            return $this->error('不是群组成员，无法发布帖子');
        }

        // 处理帖子类型
        $type = $request->type ?? 0;
        if ($type === 1 && !$request->images) {
            return $this->error('图片帖子必须包含图片');
        }

        if ($type === 2 && !$request->link_url) {
            return $this->error('链接帖子必须包含链接URL');
        }

        DB::beginTransaction();
        try {
            $post = Post::create([
                'group_id' => $request->group_id,
                'user_id' => $request->user()->id,
                'content' => $request->content,
                'type' => $type,
                'images' => $request->images,
                'link_url' => $request->link_url,
                'link_title' => $request->link_title,
                'link_image' => $request->link_image,
                'link_description' => $request->link_description,
                'status' => 1,
            ]);

            // 更新群组帖子数
            $group->increment('post_count');
            
            DB::commit();
            return $this->success($post->load(['user.profile', 'group']), '发布成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('发布失败：' . $e->getMessage());
        }
    }

    // 获取帖子列表
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'group_id' => 'nullable|exists:groups,id',
            'type' => 'nullable|integer|in:0,1,2',
            'page' => 'nullable|integer|min:1',
            'size' => 'nullable|integer|min:1|max:50',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $query = Post::with(['user.profile', 'group'])
            ->where('status', 1);

        // 筛选群组
        if ($request->group_id) {
            $query->where('group_id', $request->group_id);
        }

        // 筛选类型
        if ($request->type !== null) {
            $query->where('type', $request->type);
        }

        // 排序：置顶优先，然后按时间倒序
        $query->orderBy('pinned_at', 'desc')
              ->orderBy('created_at', 'desc');

        $page = $request->page ?? 1;
        $size = $request->size ?? 20;
        $posts = $query->paginate($size, ['*'], 'page', $page);

        // 添加当前用户点赞状态
        $user = Auth::user();
        if ($user) {
            $posts->getCollection()->each(function ($post) use ($user) {
                $post->is_liked = $post->isLikedBy($user->id);
            });
        }

        return $this->paginate($posts);
    }

    // 获取帖子详情
    public function show($id)
    {
        $post = Post::with([
            'user.profile',
            'group',
            'comments' => function ($query) {
                $query->where('status', 1)
                      ->with('user.profile')
                      ->orderBy('created_at', 'asc');
            }
        ])->find($id);

        if (!$post || $post->status !== 1) {
            return $this->error('帖子不存在', 404);
        }

        // 检查权限（私有群组的帖子只有成员可见）
        if ($post->group->type === 1) {
            $user = Auth::user();
            if (!$user || !$post->group->hasMember($user->id)) {
                return $this->error('无权限查看', 403);
            }
        }

        // 添加当前用户点赞状态
        $user = Auth::user();
        if ($user) {
            $post->is_liked = $post->isLikedBy($user->id);
            
            // 添加评论点赞状态
            $post->comments->each(function ($comment) use ($user) {
                $comment->is_liked = $comment->isLikedBy($user->id);
            });
        }

        return $this->success($post);
    }

    // 删除帖子
    public function destroy(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return $this->error('帖子不存在', 404);
        }

        // 检查权限
        if (!$request->user()->can('manage-post', $post)) {
            return $this->error('无权限操作', 403);
        }

        DB::beginTransaction();
        try {
            $post->softDelete();
            
            // 更新群组帖子数
            $post->group->decrement('post_count');
            
            DB::commit();
            return $this->success([], '删除成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('删除失败：' . $e->getMessage());
        }
    }

    // 点赞/取消点赞帖子
    public function like(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post || $post->status !== 1) {
            return $this->error('帖子不存在', 404);
        }

        $user = $request->user();
        $like = $post->likes()->where('user_id', $user->id)->first();

        DB::beginTransaction();
        try {
            if ($like) {
                // 取消点赞
                $like->delete();
                $post->decrement('like_count');
                $isLiked = false;
            } else {
                // 点赞
                $post->likes()->create([
                    'user_id' => $user->id,
                    'target_type' => 1,
                ]);
                $post->increment('like_count');
                $isLiked = true;
            }

            DB::commit();
            return $this->success(['is_liked' => $isLiked], $isLiked ? '点赞成功' : '取消点赞');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('操作失败：' . $e->getMessage());
        }
    }

    // 发布评论
    public function comment(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post || $post->status !== 1) {
            return $this->error('帖子不存在', 404);
        }

        // 检查是否有权限评论（需要是群组成员）
        if (!$post->group->hasMember($request->user()->id)) {
            return $this->error('无权限评论');
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:500',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // 检查父评论是否属于该帖子
        if ($request->parent_id) {
            $parent = Comment::find($request->parent_id);
            if (!$parent || $parent->post_id !== $post->id) {
                return $this->error('无效的父评论');
            }
        }

        DB::beginTransaction();
        try {
            $comment = Comment::create([
                'post_id' => $post->id,
                'user_id' => $request->user()->id,
                'parent_id' => $request->parent_id,
                'content' => $request->content,
                'status' => 1,
            ]);

            // 更新帖子评论数
            $post->increment('comment_count');
            
            DB::commit();
            return $this->success($comment->load('user.profile'), '评论成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('评论失败：' . $e->getMessage());
        }
    }

    // 删除评论
    public function deleteComment(Request $request, $postId, $commentId)
    {
        $post = Post::find($postId);
        if (!$post) {
            return $this->error('帖子不存在', 404);
        }

        $comment = Comment::find($commentId);
        if (!$comment || $comment->post_id !== $post->id) {
            return $this->error('评论不存在', 404);
        }

        // 检查权限（评论作者或群组管理员可以删除）
        if ($comment->user_id !== $request->user()->id) {
            if (!$request->user()->can('manage-post', $post)) {
                return $this->error('无权限操作', 403);
            }
        }

        DB::beginTransaction();
        try {
            $comment->softDelete();
            
            // 更新帖子评论数
            $post->decrement('comment_count');
            
            DB::commit();
            return $this->success([], '删除成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('删除失败：' . $e->getMessage());
        }
    }

    // 点赞/取消点赞评论
    public function likeComment(Request $request, $postId, $commentId)
    {
        $comment = Comment::find($commentId);
        if (!$comment || $comment->status !== 1 || $comment->post_id != $postId) {
            return $this->error('评论不存在', 404);
        }

        $user = $request->user();
        $like = $comment->likes()->where('user_id', $user->id)->first();

        DB::beginTransaction();
        try {
            if ($like) {
                // 取消点赞
                $like->delete();
                $comment->decrement('like_count');
                $isLiked = false;
            } else {
                // 点赞
                $comment->likes()->create([
                    'user_id' => $user->id,
                    'target_type' => 2,
                ]);
                $comment->increment('like_count');
                $isLiked = true;
            }

            DB::commit();
            return $this->success(['is_liked' => $isLiked], $isLiked ? '点赞成功' : '取消点赞');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('操作失败：' . $e->getMessage());
        }
    }

    // 举报帖子
    public function report(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post || $post->status !== 1) {
            return $this->error('帖子不存在', 404);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'required|integer|in:1,2,3,4',
            'description' => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // 检查是否已经举报过
        $exists = Report::where('reporter_id', $request->user()->id)
            ->where('target_type', 1)
            ->where('target_id', $post->id)
            ->where('status', 0)
            ->exists();

        if ($exists) {
            return $this->error('已经举报过该帖子');
        }

        Report::create([
            'reporter_id' => $request->user()->id,
            'target_type' => 1,
            'target_id' => $post->id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 0,
        ]);

        return $this->success([], '举报成功，我们会尽快处理');
    }

    // 置顶/取消置顶帖子（管理员功能）
    public function pin(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return $this->error('帖子不存在', 404);
        }

        // 检查权限
        if (!$request->user()->can('manage-post', $post)) {
            return $this->error('无权限操作', 403);
        }

        if ($post->pinned_at) {
            $post->unpin();
            return $this->success([], '取消置顶成功');
        } else {
            $post->pin();
            return $this->success([], '置顶成功');
        }
    }
}