<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Follow;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $follows = [
            // Alice (1) follows Bob, Carol, David
            ['follower_id' => 1, 'following_id' => 2],
            ['follower_id' => 1, 'following_id' => 3],
            ['follower_id' => 1, 'following_id' => 4],
            
            // Bob (2) follows Alice, Carol, Emma
            ['follower_id' => 2, 'following_id' => 1],
            ['follower_id' => 2, 'following_id' => 3],
            ['follower_id' => 2, 'following_id' => 5],
            
            // Carol (3) follows Alice, Bob
            ['follower_id' => 3, 'following_id' => 1],
            ['follower_id' => 3, 'following_id' => 2],
            
            // David (4) follows Alice, Emma
            ['follower_id' => 4, 'following_id' => 1],
            ['follower_id' => 4, 'following_id' => 5],
            
            // Emma (5) follows David
            ['follower_id' => 5, 'following_id' => 4],
        ];

        foreach ($follows as $follow) {
            Follow::create($follow);
        }
    }
}
