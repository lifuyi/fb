<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nickname',
        'avatar_url',
        'bio',
        'gender',
        'birth_year',
        'university_id',
        'major',
        'graduation_year',
        'skills',
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 关联大学
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    // 获取性别文本
    public function getGenderTextAttribute()
    {
        return match($this->gender) {
            1 => '男',
            2 => '女',
            default => '未知',
        };
    }

    // 获取年龄
    public function getAgeAttribute()
    {
        return $this->birth_year ? date('Y') - $this->birth_year : null;
    }
}