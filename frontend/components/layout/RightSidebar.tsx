'use client';

import Link from 'next/link';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { TrendingUp, Users } from 'lucide-react';

// Mock data - will be replaced with real API calls
const suggestedGroups = [
  { id: 1, name: '哈工大编程交流', members: 1234, avatar: null },
  { id: 2, name: '东北林业大学', members: 856, avatar: null },
  { id: 3, name: '黑龙江大学兼职', members: 623, avatar: null },
];

const trendingTopics = [
  { id: 1, name: '#期末考试', posts: 234 },
  { id: 2, name: '#寒假兼职', posts: 189 },
  { id: 3, name: '#考研加油', posts: 156 },
  { id: 4, name: '#校园生活', posts: 98 },
];

export default function RightSidebar() {
  return (
    <aside className="w-80 space-y-4">
      {/* Suggested Groups */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-primary-700" />
          <h3 className="font-semibold text-gray-900 dark:text-white">推荐群组</h3>
        </div>
        
        <div className="space-y-3">
          {suggestedGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Avatar src={group.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {group.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {group.members} 成员
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                加入
              </Button>
            </div>
          ))}
        </div>
        
        <Link href="/groups/discover" className="block mt-3 text-sm text-primary-700 hover:underline">
          查看更多群组 →
        </Link>
      </Card>

      {/* Trending Topics */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-primary-700" />
          <h3 className="font-semibold text-gray-900 dark:text-white">热门话题</h3>
        </div>
        
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <p className="text-sm font-medium text-primary-700">{topic.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {topic.posts} 条帖子
              </p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Footer Links */}
      <div className="px-4 text-xs text-gray-500 dark:text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Link href="/about" className="hover:underline">关于</Link>
          <span>·</span>
          <Link href="/help" className="hover:underline">帮助</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">隐私</Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">条款</Link>
        </div>
        <p>© 2024 Campus Connect</p>
      </div>
    </aside>
  );
}
