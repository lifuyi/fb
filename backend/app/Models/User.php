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