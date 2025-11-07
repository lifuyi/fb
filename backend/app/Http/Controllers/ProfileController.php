<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Post;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * 获取用户个人资料
     */
    public function show(Request $request, $userId = null)
    {
        $userId = $userId ?? $request->user()->id;
        
        $user = User::with(['profile.university'])->find($userId);
        
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        // 获取用户统计信息
        $stats = [
            'posts_count' => Post::where('user_id', $userId)->where('status', 1)->count(),
            'groups_count' => $user->groupMembers()->count(),
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
        ];
        
        // 如果不是查看自己的资料，添加是否关注的信息
        if ($userId !== $request->user()->id) {
            $stats['is_following'] = $request->user()->isFollowing($userId);
        }
        
        return $this->success([
            'user' => $user,
            'stats' => $stats,
        ]);
    }
    
    /**
     * 更新用户资料
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nickname' => 'nullable|string|max:50',
            'bio' => 'nullable|string|max:500',
            'gender' => 'nullable|integer|in:0,1,2',
            'birth_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'university_id' => 'nullable|exists:universities,id',
            'major' => 'nullable|string|max:100',
            'graduation_year' => 'nullable|integer|min:' . date('Y') . '|max:' . (date('Y') + 10),
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $profile = $request->user()->profile;
        
        if (!$profile) {
            $profile = UserProfile::create([
                'user_id' => $request->user()->id,
            ]);
        }
        
        $profile->update($request->only([
            'nickname', 'bio', 'gender', 'birth_year',
            'university_id', 'major', 'graduation_year', 'skills'
        ]));

        return $this->success($profile->load('university'), '更新成功');
    }
    
    /**
     * 上传头像
     */
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $profile = $request->user()->profile;
        
        if (!$profile) {
            $profile = UserProfile::create([
                'user_id' => $request->user()->id,
            ]);
        }

        // 删除旧头像
        if ($profile->avatar_url && Storage::exists($profile->avatar_url)) {
            Storage::delete($profile->avatar_url);
        }

        // 上传新头像
        $path = $request->file('avatar')->store('avatars', 'public');
        $profile->update(['avatar_url' => $path]);

        return $this->success([
            'avatar_url' => Storage::url($path),
        ], '头像上传成功');
    }
    
    /**
     * 获取用户发布的帖子
     */
    public function posts(Request $request, $userId = null)
    {
        // Handle 'posts' string in route parameter
        if ($userId === 'posts') {
            $userId = null;
        }
        
        $userId = $userId ?? $request->user()->id;
        
        $user = User::find($userId);
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        $page = $request->input('page', 1);
        $size = $request->input('size', 10);
        
        $posts = Post::with(['user.profile', 'group', 'comments.user.profile'])
            ->where('user_id', $userId)
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->paginate($size, ['*'], 'page', $page);
        
        // 添加当前用户是否点赞的信息
        $currentUserId = $request->user()->id;
        foreach ($posts as $post) {
            $post->is_liked = $post->isLikedBy($currentUserId);
        }
        
        return $this->paginate($posts);
    }
    
    /**
     * 获取用户加入的群组
     */
    public function groups(Request $request, $userId = null)
    {
        // Handle 'groups' string in route parameter
        if ($userId === 'groups') {
            $userId = null;
        }
        
        $userId = $userId ?? $request->user()->id;
        
        $user = User::find($userId);
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        $page = $request->input('page', 1);
        $size = $request->input('size', 10);
        
        $groups = Group::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['creator.profile'])
        ->withCount('members')
        ->orderBy('created_at', 'desc')
        ->paginate($size, ['*'], 'page', $page);
        
        return $this->paginate($groups);
    }
    
    /**
     * 更新邮箱
     */
    public function updateEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:128|unique:users,email,' . $request->user()->id,
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $user = $request->user();
        
        if (!Hash::check($request->password, $user->password)) {
            return $this->error('密码错误');
        }

        $user->update(['email' => $request->email]);

        return $this->success([], '邮箱更新成功');
    }
    
    /**
     * 更新手机号
     */
    public function updatePhone(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^1[3-9]\d{9}$/|unique:users,phone,' . $request->user()->id,
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // TODO: 验证短信验证码
        // if (!$this->verifySmsCode($request->phone, $request->code)) {
        //     return $this->error('验证码错误');
        // }

        $request->user()->update(['phone' => $request->phone]);

        return $this->success([], '手机号更新成功');
    }
    
    /**
     * 修改密码
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $user = $request->user();
        
        if (!Hash::check($request->old_password, $user->password)) {
            return $this->error('原密码错误');
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return $this->success([], '密码修改成功');
    }
}
