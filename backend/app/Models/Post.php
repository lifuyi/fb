<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'content',
        'type',
        'images',
        'link_url',
        'link_title',
        'link_image',
        'link_description',
        'like_count',
        'comment_count',
        'share_count',
        'status',
        'pinned_at',
    ];

    protected $casts = [
        'images' => 'array',
        'pinned_at' => 'datetime',
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

    // 关联评论
    public function comments()
    {
        return $this->hasMany(Comment::class)->where('status', 1);
    }

    // 关联点赞
    public function likes()
    {
        return $this->morphMany(Like::class, 'targetable');
    }

    // 获取点赞用户
    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'likes', 'target_id', 'user_id')
            ->where('target_type', 1);
    }

    // 检查用户是否点赞
    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    // 获取类型文本
    public function getTypeTextAttribute()
    {
        return match($this->type) {
            0 => '文字',
            1 => '图片',
            2 => '链接',
            3 => '视频',
            default => '未知',
        };
    }

    // 获取状态文本
    public function getStatusTextAttribute()
    {
        return $this->status ? '正常' : '已删除';
    }

    // 更新点赞数
    public function updateLikeCount()
    {
        $this->like_count = $this->likes()->count();
        $this->save();
    }

    // 更新评论数
    public function updateCommentCount()
    {
        $this->comment_count = $this->comments()->count();
        $this->save();
    }

    // 置顶帖子
    public function pin()
    {
        $this->pinned_at = now();
        $this->save();
    }

    // 取消置顶
    public function unpin()
    {
        $this->pinned_at = null;
        $this->save();
    }

    // 软删除
    public function softDelete()
    {
        $this->status = 0;
        $this->save();
    }

    // 恢复
    public function restore()
    {
        $this->status = 1;
        $this->save();
    }
}