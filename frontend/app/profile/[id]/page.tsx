'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import PostList from '@/components/post/PostList';
import GroupList from '@/components/group/GroupList';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile, useProfilePosts, useProfileGroups } from '@/lib/hooks/useProfile';

export default function UserProfilePage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id ? parseInt(params.id as string) : undefined;

  const [activeTab, setActiveTab] = useState<'posts' | 'groups'>('posts');

  const { profile, isLoading: profileLoading, error: profileError } = useProfile(userId);
  const { posts, isLoading: postsLoading, refetch: refetchPosts } = useProfilePosts(userId);
  const { groups, isLoading: groupsLoading } = useProfileGroups(userId);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Redirect to own profile if viewing self
  useEffect(() => {
    if (user && userId === user.id) {
      router.push('/profile');
    }
  }, [user, userId, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  if (profileError) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {profileError}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={false}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'posts' && (
          <div>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
              </div>
            ) : posts.length > 0 ? (
              <PostList posts={posts} onPostDeleted={refetchPosts} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">还没有发布任何帖子</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'groups' && (
          <div>
            {groupsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
              </div>
            ) : groups.length > 0 ? (
              <GroupList groups={groups} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">还没有加入任何群组</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
