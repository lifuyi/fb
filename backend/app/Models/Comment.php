<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'content',
        'like_count',
        'status',
    ];

    // 关联帖子
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 关联父评论
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // 关联子评论
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->where('status', 1);
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
            ->where('target_type', 2);
    }

    // 检查用户是否点赞
    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
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