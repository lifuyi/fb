<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'content',
        'data',
        'is_read',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
    ];

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 标记为已读
    public function markAsRead()
    {
        $this->is_read = 1;
        $this->save();
    }

    // 获取类型文本
    public function getTypeTextAttribute()
    {
        return match($this->type) {
            1 => '点赞',
            2 => '评论',
            3 => '关注',
            4 => '系统通知',
            default => '未知',
        };
    }
}
