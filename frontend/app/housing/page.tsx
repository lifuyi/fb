'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import { useAuth } from '@/lib/hooks/useAuth';

export default function HousingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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
      <Card className="p-12 text-center">
        <MapPin className="h-16 w-16 mx-auto mb-4 text-primary-700" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          房屋租赁
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          这个功能即将上线，敬请期待！
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Phase 1 正在开发中...
        </p>
      </Card>
    </MainLayout>
  );
}
