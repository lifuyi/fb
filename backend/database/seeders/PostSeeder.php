<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = [
            [
                'group_id' => 1,
                'user_id' => 1,
                'content' => '大家好！我是Alice，刚刚加入这个技术交流群。我对Web开发很感兴趣，特别是React和Node.js。希望能在这里认识更多志同道合的朋友！',
                'type' => 0,
                'status' => 1,
                'like_count' => 3,
                'comment_count' => 2,
                'likes' => [2, 3, 4],
                'comments' => [
                    ['user_id' => 2, 'content' => '欢迎欢迎！我也在学React，可以一起交流'],
                    ['user_id' => 3, 'content' => '欢迎加入！有问题随时提问'],
                ],
            ],
            [
                'group_id' => 1,
                'user_id' => 2,
                'content' => '分享一个很棒的Docker教程，对容器化部署感兴趣的同学可以看看：https://docs.docker.com/get-started/',
                'type' => 2,
                'link_url' => 'https://docs.docker.com/get-started/',
                'link_title' => 'Docker Get Started',
                'link_description' => 'Docker官方入门教程，从基础到实践',
                'status' => 1,
                'like_count' => 5,
                'comment_count' => 1,
                'likes' => [1, 3, 4, 5],
                'comments' => [
                    ['user_id' => 4, 'content' => '很实用的教程，谢谢分享！'],
                ],
            ],
            [
                'group_id' => 2,
                'user_id' => 3,
                'content' => '今天完成了一个新的UI设计项目，使用Figma做的原型设计。前端开发真的需要懂一些设计知识，这样才能更好地还原设计稿。',
                'type' => 0,
                'status' => 1,
                'like_count' => 4,
                'comment_count' => 2,
                'likes' => [1, 2],
                'comments' => [
                    ['user_id' => 1, 'content' => '确实！懂设计的开发者太宝贵了'],
                    ['user_id' => 2, 'content' => '可以分享一下你的设计吗？'],
                ],
            ],
            [
                'group_id' => 3,
                'user_id' => 4,
                'content' => '推荐一个机器学习的在线课程：Andrew Ng的Machine Learning课程。这是我见过最好的入门课程，讲解清晰，案例丰富。',
                'type' => 0,
                'status' => 1,
                'like_count' => 6,
                'comment_count' => 3,
                'likes' => [1, 5],
                'comments' => [
                    ['user_id' => 1, 'content' => '已经在学了，确实很棒！'],
                    ['user_id' => 5, 'content' => '这个课程我也在学，受益匪浅'],
                ],
            ],
            [
                'group_id' => 5,
                'user_id' => 2,
                'content' => '【兼职招聘】某互联网公司招聘前端开发实习生，要求熟悉React，每周至少3天，薪资150-200/天。有意者可以联系我！',
                'type' => 0,
                'status' => 1,
                'like_count' => 8,
                'comment_count' => 4,
                'likes' => [1, 3],
                'comments' => [
                    ['user_id' => 1, 'content' => '我对这个职位感兴趣，可以详细了解一下吗？'],
                    ['user_id' => 3, 'content' => '请问需要什么技术栈？'],
                ],
            ],
            [
                'group_id' => 1,
                'user_id' => 5,
                'content' => '分享一下我最近在做的医疗AI项目，使用深度学习进行医学影像分析。技术栈包括Python、TensorFlow、FastAPI。代码已开源到GitHub。',
                'type' => 0,
                'status' => 1,
                'like_count' => 7,
                'comment_count' => 2,
                'likes' => [1, 4],
                'comments' => [
                    ['user_id' => 4, 'content' => '这个项目很有意义！可以给个GitHub链接吗？'],
                ],
            ],
            [
                'group_id' => 2,
                'user_id' => 1,
                'content' => 'Next.js 14发布了！新增了很多激动人心的特性，特别是Server Actions和improved routing。准备在新项目中试试。',
                'type' => 0,
                'status' => 1,
                'like_count' => 5,
                'comment_count' => 3,
                'likes' => [2, 3],
                'comments' => [
                    ['user_id' => 2, 'content' => 'Server Actions确实很方便！'],
                    ['user_id' => 3, 'content' => '已经在用了，体验很好'],
                ],
            ],
            [
                'group_id' => 3,
                'user_id' => 5,
                'content' => '今天参加了一个数据科学的workshop，学到了很多关于特征工程的技巧。分享一些笔记：1. 特征选择很重要 2. 交叉验证必不可少 3. 要注意过拟合问题',
                'type' => 0,
                'status' => 1,
                'like_count' => 4,
                'comment_count' => 1,
                'likes' => [4],
                'comments' => [
                    ['user_id' => 4, 'content' => '感谢分享！特征工程确实是机器学习中很关键的一步'],
                ],
            ],
            [
                'group_id' => 4,
                'user_id' => 1,
                'content' => '周末组织一个线下技术沙龙，地点在哈工大校园内的咖啡厅。欢迎大家来交流！主题：全栈开发最佳实践',
                'type' => 0,
                'status' => 1,
                'like_count' => 6,
                'comment_count' => 3,
                'pinned_at' => now(),
                'likes' => [2],
                'comments' => [
                    ['user_id' => 2, 'content' => '什么时候？我想参加'],
                ],
            ],
            [
                'group_id' => 5,
                'user_id' => 3,
                'content' => '【求职】UI/UX设计师，熟悉Figma、Sketch，有2年工作经验。寻找远程或哈尔滨本地的工作机会。作品集：https://portfolio.example.com',
                'type' => 2,
                'link_url' => 'https://portfolio.example.com',
                'link_title' => 'Carol Liu - UI/UX Portfolio',
                'link_description' => '查看我的设计作品集',
                'status' => 1,
                'like_count' => 3,
                'comment_count' => 2,
                'likes' => [1, 2],
                'comments' => [
                    ['user_id' => 1, 'content' => '作品很棒！'],
                ],
            ],
            [
                'group_id' => 1,
                'user_id' => 4,
                'content' => 'Python 3.12正式版发布了！性能提升显著，特别是在多线程场景下。已经开始升级项目依赖了。',
                'type' => 0,
                'status' => 1,
                'like_count' => 5,
                'comment_count' => 1,
                'likes' => [1, 5],
                'comments' => [
                    ['user_id' => 5, 'content' => '太好了！等着升级呢'],
                ],
            ],
            [
                'group_id' => 2,
                'user_id' => 2,
                'content' => 'TypeScript + React开发最佳实践分享：1. 使用严格模式 2. 善用类型推断 3. 定义清晰的接口 4. 使用泛型提高复用性',
                'type' => 0,
                'status' => 1,
                'like_count' => 7,
                'comment_count' => 2,
                'likes' => [1, 3],
                'comments' => [
                    ['user_id' => 1, 'content' => '非常实用的建议！'],
                    ['user_id' => 3, 'content' => '已收藏，感谢分享'],
                ],
            ],
        ];

        foreach ($posts as $postData) {
            $likes = $postData['likes'] ?? [];
            $comments = $postData['comments'] ?? [];
            unset($postData['likes'], $postData['comments']);

            $post = Post::create($postData);

            // 添加点赞
            foreach ($likes as $userId) {
                Like::create([
                    'user_id' => $userId,
                    'target_type' => 1, // 帖子
                    'target_id' => $post->id,
                ]);
            }

            // 添加评论
            foreach ($comments as $commentData) {
                $comment = Comment::create([
                    'post_id' => $post->id,
                    'user_id' => $commentData['user_id'],
                    'content' => $commentData['content'],
                    'status' => 1,
                ]);
            }

            // 更新统计
            $post->update([
                'like_count' => count($likes),
                'comment_count' => count($comments),
            ]);
        }

        // 更新群组帖子数
        foreach ([1, 2, 3, 4, 5] as $groupId) {
            $postCount = Post::where('group_id', $groupId)->where('status', 1)->count();
            \App\Models\Group::find($groupId)->update(['post_count' => $postCount]);
        }
    }
}
