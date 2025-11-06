<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\University;

class UniversitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $universities = [
            [
                'name' => '哈尔滨工业大学',
                'domain' => 'hit.edu.cn',
                'province' => '黑龙江',
                'city' => '哈尔滨',
                'address' => '哈尔滨市南岗区西大直街92号',
                'latitude' => 45.7423,
                'longitude' => 126.6359,
                'status' => 1,
            ],
            [
                'name' => '哈尔滨工程大学',
                'domain' => 'hrbeu.edu.cn',
                'province' => '黑龙江',
                'city' => '哈尔滨',
                'address' => '哈尔滨市南岗区南通大街145号',
                'latitude' => 45.7773,
                'longitude' => 126.6784,
                'status' => 1,
            ],
            [
                'name' => '东北林业大学',
                'domain' => 'nefu.edu.cn',
                'province' => '黑龙江',
                'city' => '哈尔滨',
                'address' => '哈尔滨市香坊区和兴路26号',
                'latitude' => 45.7246,
                'longitude' => 126.6298,
                'status' => 1,
            ],
            [
                'name' => '黑龙江大学',
                'domain' => 'hlju.edu.cn',
                'province' => '黑龙江',
                'city' => '哈尔滨',
                'address' => '哈尔滨市南岗区学府路74号',
                'latitude' => 45.7423,
                'longitude' => 126.6359,
                'status' => 1,
            ],
            [
                'name' => '哈尔滨医科大学',
                'domain' => 'hrbmu.edu.cn',
                'province' => '黑龙江',
                'city' => '哈尔滨',
                'address' => '哈尔滨市南岗区学府路194号',
                'latitude' => 45.7423,
                'longitude' => 126.6359,
                'status' => 1,
            ],
        ];

        foreach ($universities as $university) {
            University::create($university);
        }
    }
}