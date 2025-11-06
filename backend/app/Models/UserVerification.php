<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'status',
        'data',
        'remark',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'data' => 'array',
        'reviewed_at' => 'datetime',
    ];

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 关联审核人
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // 获取类型文本
    public function getTypeTextAttribute()
    {
        return match($this->type) {
            1 => '学生证',
            2 => '邮箱',
            3 => '实名',
            default => '未知',
        };
    }

    // 获取状态文本
    public function getStatusTextAttribute()
    {
        return match($this->status) {
            0 => '待审核',
            1 => '已通过',
            2 => '已拒绝',
            default => '未知',
        };
    }
}