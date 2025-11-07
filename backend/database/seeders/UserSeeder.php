<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'email' => 'alice@hit.edu.cn',
                'password' => Hash::make('password123'),
                'status' => 1,
                'profile' => [
                    'nickname' => 'Alice Wang',
                    'bio' => '计算机科学爱好者，喜欢编程和摄影',
                    'gender' => 2,
                    'birth_year' => 2002,
                    'university_id' => 1,
                    'major' => '计算机科学与技术',
                    'graduation_year' => 2024,
                    'skills' => ['Python', 'Java', 'React', '摄影'],
                ],
            ],
            [
                'email' => 'bob@hrbeu.edu.cn',
                'password' => Hash::make('password123'),
                'status' => 1,
                'profile' => [
                    'nickname' => 'Bob Chen',
                    'bio' => '软件工程师，热爱开源项目',
                    'gender' => 1,
                    'birth_year' => 2001,
                    'university_id' => 2,
                    'major' => '软件工程',
                    'graduation_year' => 2024,
                    'skills' => ['JavaScript', 'Node.js', 'Docker', 'Kubernetes'],
                ],
            ],
            [
                'email' => 'carol@nefu.edu.cn',
                'password' => Hash::make('password123'),
                'status' => 1,
                'profile' => [
                    'nickname' => 'Carol Liu',
                    'bio' => '设计师 + 前端开发，追求美与技术的结合',
                    'gender' => 2,
                    'birth_year' => 2003,
                    'university_id' => 3,
                    'major' => '数字媒体技术',
                    'graduation_year' => 2025,
                    'skills' => ['UI/UX Design', 'Figma', 'Vue.js', 'CSS'],
                ],
            ],
            [
                'email' => 'david@hlju.edu.cn',
                'password' => Hash::make('password123'),
                'status' => 1,
                'profile' => [
                    'nickname' => 'David Zhang',
                    'bio' => '数据科学与机器学习研究者',
                    'gender' => 1,
                    'birth_year' => 2000,
                    'university_id' => 4,
                    'major' => '数据科学',
                    'graduation_year' => 2024,
                    'skills' => ['Python', 'TensorFlow', 'PyTorch', 'SQL'],
                ],
            ],
            [
                'email' => 'emma@hrbmu.edu.cn',
                'password' => Hash::make('password123'),
                'status' => 1,
                'profile' => [
                    'nickname' => 'Emma Li',
                    'bio' => '医学信息学专业，对医疗AI感兴趣',
                    'gender' => 2,
                    'birth_year' => 2002,
                    'university_id' => 5,
                    'major' => '医学信息学',
                    'graduation_year' => 2024,
                    'skills' => ['Python', 'R', '数据分析', '医疗知识'],
                ],
            ],
        ];

        foreach ($users as $userData) {
            $profileData = $userData['profile'];
            unset($userData['profile']);

            $user = User::create($userData);
            $profileData['user_id'] = $user->id;
            UserProfile::create($profileData);
        }
    }
}
