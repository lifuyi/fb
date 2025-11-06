<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    // 创建群组
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|string|max:500',
            'type' => 'required|integer|in:0,1,2',
            'university_id' => 'nullable|exists:universities,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:20',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        DB::beginTransaction();
        try {
            $group = Group::create([
                'name' => $request->name,
                'description' => $request->description,
                'avatar_url' => $request->avatar_url,
                'type' => $request->type,
                'owner_id' => $request->user()->id,
                'university_id' => $request->university_id,
                'tags' => $request->tags,
                'member_count' => 1,
                'status' => 1,
            ]);

            // 创建者自动成为群主
            GroupMember::create([
                'group_id' => $group->id,
                'user_id' => $request->user()->id,
                'role' => 2, // 群主
                'joined_at' => now(),
            ]);

            DB::commit();
            return $this->success($group->load('owner.profile', 'university'), '创建成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('创建失败：' . $e->getMessage());
        }
    }

    // 获取群组列表
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'nullable|integer|in:0,1,2',
            'university_id' => 'nullable|exists:universities,id',
            'search' => 'nullable|string|max:50',
            'page' => 'nullable|integer|min:1',
            'size' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $query = Group::with(['owner.profile', 'university'])
            ->where('status', 1);

        // 筛选条件
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('university_id')) {
            $query->where('university_id', $request->university_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 排序
        $query->orderBy('member_count', 'desc')
              ->orderBy('created_at', 'desc');

        $page = $request->page ?? 1;
        $size = $request->size ?? 20;
        $groups = $query->paginate($size, ['*'], 'page', $page);

        return $this->paginate($groups);
    }

    // 获取群组详情
    public function show($id)
    {
        $group = Group::with(['owner.profile', 'university'])
            ->withCount('members')
            ->find($id);

        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        // 检查是否是私有群组
        if ($group->type === 1) {
            $user = Auth::user();
            if (!$user || !$group->hasMember($user->id)) {
                return $this->error('无权限访问', 403);
            }
        }

        return $this->success($group);
    }

    // 更新群组信息
    public function update(Request $request, $id)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        // 检查权限
        if (!$request->user()->can('manage-post', $group)) {
            return $this->error('无权限操作', 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:20',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $group->update($request->only([
            'name', 'description', 'avatar_url', 'tags'
        ]));

        return $this->success($group->load('owner.profile', 'university'), '更新成功');
    }

    // 删除群组
    public function destroy(Request $request, $id)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        // 只有群主可以删除群组
        if ($group->owner_id !== $request->user()->id) {
            return $this->error('无权限操作', 403);
        }

        DB::beginTransaction();
        try {
            // 删除所有成员
            $group->members()->delete();
            // 删除所有帖子
            $group->posts()->delete();
            // 删除群组
            $group->delete();

            DB::commit();
            return $this->success([], '删除成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('删除失败：' . $e->getMessage());
        }
    }

    // 加入群组
    public function join(Request $request, $id)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        $user = $request->user();

        // 检查是否已经是成员
        if ($group->hasMember($user->id)) {
            return $this->error('已经是群组成员');
        }

        // 私有群组需要验证（简化处理，直接允许加入）
        if ($group->type === 1) {
            // TODO: 实现申请流程
            return $this->error('私有群组需要邀请才能加入');
        }

        DB::beginTransaction();
        try {
            GroupMember::create([
                'group_id' => $group->id,
                'user_id' => $user->id,
                'role' => 0, // 普通成员
                'joined_at' => now(),
            ]);

            $group->increment('member_count');
            DB::commit();
            return $this->success([], '加入成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('加入失败：' . $e->getMessage());
        }
    }

    // 退出群组
    public function leave(Request $request, $id)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        $user = $request->user();

        // 群主不能直接退出群组
        if ($group->owner_id === $user->id) {
            return $this->error('群主不能退出群组');
        }

        $member = $group->members()->where('user_id', $user->id)->first();
        if (!$member) {
            return $this->error('不是群组成员');
        }

        DB::beginTransaction();
        try {
            $member->delete();
            $group->decrement('member_count');
            DB::commit();
            return $this->success([], '退出成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('退出失败：' . $e->getMessage());
        }
    }

    // 获取群组成员列表
    public function members(Request $request, $id)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        // 检查权限
        if (!$request->user()->can('group-member', $group)) {
            return $this->error('无权限访问', 403);
        }

        $members = $group->members()
            ->with('user.profile')
            ->orderBy('role', 'desc')
            ->orderBy('joined_at', 'asc')
            ->paginate($request->size ?? 20);

        return $this->paginate($members);
    }

    // 踢出成员
    public function removeMember(Request $request, $id, $userId)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        $user = $request->user();
        $memberRole = $group->getUserRole($user->id);

        // 检查权限（群主和管理员可以踢出成员）
        if ($memberRole < 1) {
            return $this->error('无权限操作', 403);
        }

        // 不能踢出群主
        if ($group->owner_id == $userId) {
            return $this->error('不能踢出群主');
        }

        // 管理员不能踢出其他管理员
        $targetMember = $group->members()->where('user_id', $userId)->first();
        if (!$targetMember) {
            return $this->error('用户不是群组成员');
        }

        if ($memberRole === 1 && $targetMember->role >= 1) {
            return $this->error('管理员不能踢出其他管理员');
        }

        DB::beginTransaction();
        try {
            $targetMember->delete();
            $group->decrement('member_count');
            DB::commit();
            return $this->success([], '踢出成功');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('操作失败：' . $e->getMessage());
        }
    }

    // 设置管理员
    public function setAdmin(Request $request, $id, $userId)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        // 只有群主可以设置管理员
        if ($group->owner_id !== $request->user()->id) {
            return $this->error('无权限操作', 403);
        }

        $member = $group->members()->where('user_id', $userId)->first();
        if (!$member) {
            return $this->error('用户不是群组成员');
        }

        $member->update(['role' => 1]);
        return $this->success([], '设置成功');
    }

    // 取消管理员
    public function unsetAdmin(Request $request, $id, $userId)
    {
        $group = Group::find($id);
        if (!$group) {
            return $this->error('群组不存在', 404);
        }

        // 只有群主可以取消管理员
        if ($group->owner_id !== $request->user()->id) {
            return $this->error('无权限操作', 403);
        }

        $member = $group->members()->where('user_id', $userId)->first();
        if (!$member || $member->role !== 1) {
            return $this->error('用户不是管理员');
        }

        $member->update(['role' => 0]);
        return $this->success([], '取消成功');
    }

    // 获取我加入的群组
    public function myGroups(Request $request)
    {
        $user = $request->user();
        
        $groups = $user->groupMembers()
            ->with(['group.owner.profile', 'group.university'])
            ->whereHas('group', function ($query) {
                $query->where('status', 1);
            })
            ->orderBy('role', 'desc')
            ->orderBy('joined_at', 'desc')
            ->paginate($request->size ?? 20);

        return $this->paginate($groups);
    }
}