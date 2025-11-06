'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePosts } from '@/lib/hooks/usePosts';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  groupId?: number;
}

export default function PostList({ groupId }: PostListProps) {
  const { posts, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(groupId);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">加载失败，请稍后重试</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">还没有帖子，快来发布第一条吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={ref} className="flex items-center justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-primary-700" />
          )}
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          没有更多内容了
        </p>
      )}
    </div>
  );
}
