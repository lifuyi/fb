<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\User;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = [
            [
                'name' => '哈尔滨技术交流',
                'description' => '哈尔滨地区各高校技术爱好者交流群，分享编程经验、项目合作',
                'type' => 'tech',
                'university_id' => 1,
                'owner_id' => 1,
                'avatar_url' => null,
                'member_count' => 5,
                'post_count' => 0,
                'status' => 1,
                'members' => [1, 2, 3, 4, 5],
            ],
            [
                'name' => '前端开发者联盟',
                'description' => '专注前端技术分享，React、Vue、Angular等框架讨论',
                'type' => 'tech',
                'university_id' => null,
                'owner_id' => 3,
                'avatar_url' => null,
                'member_count' => 3,
                'post_count' => 0,
                'status' => 1,
                'members' => [1, 2, 3],
            ],
            [
                'name' => '数据科学学习小组',
                'description' => '机器学习、深度学习、数据分析技术交流',
                'type' => 'study',
                'university_id' => null,
                'owner_id' => 4,
                'avatar_url' => null,
                'member_count' => 3,
                'post_count' => 0,
                'status' => 1,
                'members' => [1, 4, 5],
            ],
            [
                'name' => '哈工大校友圈',
                'description' => '哈尔滨工业大学校友交流平台',
                'type' => 'social',
                'university_id' => 1,
                'owner_id' => 1,
                'avatar_url' => null,
                'member_count' => 2,
                'post_count' => 0,
                'status' => 1,
                'members' => [1, 2],
            ],
            [
                'name' => '兼职信息分享',
                'description' => '发布和寻找各类兼职、实习机会',
                'type' => 'job',
                'university_id' => null,
                'owner_id' => 2,
                'avatar_url' => null,
                'member_count' => 5,
                'post_count' => 0,
                'status' => 1,
                'members' => [1, 2, 3, 4, 5],
            ],
        ];

        foreach ($groups as $groupData) {
            $members = $groupData['members'];
            unset($groupData['members']);

            $group = Group::create($groupData);

            // 添加成员
            foreach ($members as $index => $userId) {
                GroupMember::create([
                    'group_id' => $group->id,
                    'user_id' => $userId,
                    'role' => $index === 0 ? 2 : 0, // 第一个成员为创建者(管理员)
                    'status' => 1,
                    'joined_at' => now(),
                ]);
            }
        }
    }
}
