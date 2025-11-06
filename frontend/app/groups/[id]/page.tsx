'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Users, Settings } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CreatePost from '@/components/post/CreatePost';
import PostList from '@/components/post/PostList';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGroup } from '@/lib/hooks/useGroups';

export default function GroupDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupId = Number(params.id);
  
  const { group, members, isLoading } = useGroup(groupId);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!isAuthenticated || !group) {
    return null;
  }

  return (
    <MainLayout showRightSidebar={false}>
      <div className="space-y-4">
        {/* Group Header */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar src={group.avatar} size="xl" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {group.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {group.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{group.member_count} 成员</span>
                </div>
                <span>·</span>
                <span>{group.type === 'private' ? '私密群组' : '公开群组'}</span>
              </div>
            </div>
            {group.member_role === 'owner' && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                管理
              </Button>
            )}
          </div>
        </Card>

        {/* Members Preview */}
        {members && members.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">成员</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                共 {group.member_count} 人
              </span>
            </div>
            <div className="flex -space-x-2">
              {members.slice(0, 10).map((member) => (
                <Avatar
                  key={member.id}
                  src={member.user.avatar}
                  size="sm"
                  className="ring-2 ring-white dark:ring-gray-800"
                />
              ))}
              {group.member_count > 10 && (
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 ring-2 ring-white dark:ring-gray-800">
                  +{group.member_count - 10}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Create Post */}
        {group.is_member && <CreatePost groupId={groupId} />}

        {/* Posts */}
        <PostList groupId={groupId} />
      </div>
    </MainLayout>
  );
}
