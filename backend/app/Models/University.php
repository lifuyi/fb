<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'province',
        'city',
        'address',
        'latitude',
        'longitude',
        'status',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    // 关联用户资料
    public function userProfiles()
    {
        return $this->hasMany(UserProfile::class);
    }

    // 关联用户
    public function users()
    {
        return $this->hasManyThrough(User::class, UserProfile::class);
    }

    // 获取状态文本
    public function getStatusTextAttribute()
    {
        return $this->status ? '启用' : '禁用';
    }
}