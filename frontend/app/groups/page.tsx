'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import GroupList from '@/components/group/GroupList';
import CreateGroupModal from '@/components/group/CreateGroupModal';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';

export default function GroupsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">我的群组</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              加入群组，与志同道合的同学交流
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            创建群组
          </Button>
        </div>

        {/* Group List */}
        <GroupList />

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
