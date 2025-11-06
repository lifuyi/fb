<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'role',
        'remark',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    // 关联群组
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 获取角色文本
    public function getRoleTextAttribute()
    {
        return match($this->role) {
            0 => '成员',
            1 => '管理员',
            2 => '群主',
            default => '未知',
        };
    }

    // 检查是否是管理员
    public function isAdmin()
    {
        return $this->role >= 1;
    }

    // 检查是否是群主
    public function isOwner()
    {
        return $this->role === 2;
    }

    // 检查是否可以管理群组
    public function canManage()
    {
        return $this->role >= 1;
    }
}