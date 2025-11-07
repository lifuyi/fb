<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    use HasFactory;

    protected $fillable = [
        'follower_id',
        'following_id',
    ];

    // 关注者
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    // 被关注者
    public function following()
    {
        return $this->belongsTo(User::class, 'following_id');
    }
}
