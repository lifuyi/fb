<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'avatar_url',
        'type',
        'owner_id',
        'university_id',
        'tags',
        'member_count',
        'post_count',
        'status',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    // 关联群主
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // 关联大学
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    // 关联成员
    public function members()
    {
        return $this->hasMany(GroupMember::class);
    }

    // 关联帖子
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // 检查用户是否是群组成员
    public function hasMember($userId)
    {
        return $this->members()->where('user_id', $userId)->exists();
    }

    // 获取用户在群组中的角色
    public function getUserRole($userId)
    {
        $member = $this->members()->where('user_id', $userId)->first();
        return $member ? $member->role : null;
    }

    // 获取类型文本
    public function getTypeTextAttribute()
    {
        return match($this->type) {
            0 => '公开',
            1 => '私有',
            2 => '官方',
            default => '未知',
        };
    }

    // 获取状态文本
    public function getStatusTextAttribute()
    {
        return $this->status ? '正常' : '已禁用';
    }

    // 获取群主昵称
    public function getOwnerNicknameAttribute()
    {
        return $this->owner?->profile?->nickname;
    }

    // 更新成员数量
    public function updateMemberCount()
    {
        $this->member_count = $this->members()->count();
        $this->save();
    }

    // 更新帖子数量
    public function updatePostCount()
    {
        $this->post_count = $this->posts()->where('status', 1)->count();
        $this->save();
    }
}