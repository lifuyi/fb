<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'wechat_openid',
        'wechat_unionid',
        'phone',
        'email',
        'password',
        'status',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
    ];

    // 关联用户资料
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    // 关联验证记录
    public function verifications()
    {
        return $this->hasMany(UserVerification::class);
    }

    // 关联群组成员
    public function groupMembers()
    {
        return $this->hasMany(GroupMember::class);
    }

    // 关联加入的群组
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_members', 'user_id', 'group_id')
            ->withPivot(['role', 'status', 'joined_at'])
            ->withTimestamps();
    }

    // 关注的用户
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->withTimestamps();
    }

    // 关注者
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->withTimestamps();
    }

    // 通知
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // 检查是否关注了某用户
    public function isFollowing($userId)
    {
        return $this->following()->where('following_id', $userId)->exists();
    }

    // 关注用户
    public function follow($userId)
    {
        if (!$this->isFollowing($userId) && $this->id !== $userId) {
            $this->following()->attach($userId);
            
            // 创建通知
            Notification::create([
                'user_id' => $userId,
                'type' => 3,
                'title' => '新关注',
                'content' => $this->profile->nickname . ' 关注了你',
                'data' => ['follower_id' => $this->id],
            ]);
            
            return true;
        }
        return false;
    }

    // 取消关注
    public function unfollow($userId)
    {
        return $this->following()->detach($userId);
    }

    // 检查是否已验证
    public function isVerified()
    {
        return $this->status === 1;
    }

    // 检查是否被禁用
    public function isDisabled()
    {
        return $this->status === 2;
    }

    // 获取用户头像
    public function getAvatarAttribute()
    {
        return $this->profile?->avatar_url ?? null;
    }

    // 获取用户昵称
    public function getNicknameAttribute()
    {
        return $this->profile?->nickname ?? $this->phone ?? $this->email;
    }
}