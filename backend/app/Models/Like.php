<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'target_type',
        'target_id',
    ];

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 获取目标对象
    public function targetable()
    {
        return $this->morphTo();
    }

    // 获取目标类型文本
    public function getTargetTypeTextAttribute()
    {
        return match($this->target_type) {
            1 => '帖子',
            2 => '评论',
            default => '未知',
        };
    }
}