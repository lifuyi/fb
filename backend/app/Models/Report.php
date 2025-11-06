<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'target_type',
        'target_id',
        'reason',
        'description',
        'status',
        'admin_remark',
        'handled_by',
        'handled_at',
    ];

    protected $casts = [
        'handled_at' => 'datetime',
    ];

    // 关联举报人
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    // 关联处理人
    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    // 获取目标对象
    public function target()
    {
        return match($this->target_type) {
            1 => Post::find($this->target_id),
            2 => Comment::find($this->target_id),
            3 => User::find($this->target_id),
            4 => Group::find($this->target_id),
            default => null,
        };
    }

    // 获取类型文本
    public function getTargetTypeTextAttribute()
    {
        return match($this->target_type) {
            1 => '帖子',
            2 => '评论',
            3 => '用户',
            4 => '群组',
            default => '未知',
        };
    }

    // 获取原因文本
    public function getReasonTextAttribute()
    {
        return match($this->reason) {
            1 => '垃圾信息',
            2 => '违法内容',
            3 => '人身攻击',
            4 => '其他',
            default => '未知',
        };
    }

    // 获取状态文本
    public function getStatusTextAttribute()
    {
        return match($this->status) {
            0 => '待处理',
            1 => '已处理',
            2 => '已忽略',
            default => '未知',
        };
    }

    // 标记为已处理
    public function markAsHandled($adminId, $remark = null)
    {
        $this->update([
            'status' => 1,
            'admin_remark' => $remark,
            'handled_by' => $adminId,
            'handled_at' => now(),
        ]);
    }

    // 标记为已忽略
    public function markAsIgnored($adminId, $remark = null)
    {
        $this->update([
            'status' => 2,
            'admin_remark' => $remark,
            'handled_by' => $adminId,
            'handled_at' => now(),
        ]);
    }
}