<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * 关注用户
     */
    public function follow(Request $request, $userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        if ($request->user()->id === $userId) {
            return $this->error('不能关注自己');
        }
        
        if ($request->user()->isFollowing($userId)) {
            return $this->error('已经关注过该用户');
        }
        
        $request->user()->follow($userId);
        
        return $this->success([], '关注成功');
    }
    
    /**
     * 取消关注
     */
    public function unfollow(Request $request, $userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        if (!$request->user()->isFollowing($userId)) {
            return $this->error('未关注该用户');
        }
        
        $request->user()->unfollow($userId);
        
        return $this->success([], '取消关注成功');
    }
    
    /**
     * 获取关注列表
     */
    public function following(Request $request, $userId = null)
    {
        $userId = $userId ?? $request->user()->id;
        
        $user = User::find($userId);
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        $page = $request->input('page', 1);
        $size = $request->input('size', 20);
        
        $following = $user->following()
            ->with('profile.university')
            ->paginate($size, ['*'], 'page', $page);
        
        return $this->paginate($following);
    }
    
    /**
     * 获取粉丝列表
     */
    public function followers(Request $request, $userId = null)
    {
        $userId = $userId ?? $request->user()->id;
        
        $user = User::find($userId);
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        $page = $request->input('page', 1);
        $size = $request->input('size', 20);
        
        $followers = $user->followers()
            ->with('profile.university')
            ->paginate($size, ['*'], 'page', $page);
        
        return $this->paginate($followers);
    }
    
    /**
     * 检查关注状态
     */
    public function checkFollowStatus(Request $request, $userId)
    {
        $isFollowing = $request->user()->isFollowing($userId);
        
        return $this->success([
            'is_following' => $isFollowing,
        ]);
    }
}
