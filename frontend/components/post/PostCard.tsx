'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { Post } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { usePosts } from '@/lib/hooks/usePosts';
import { useAuth } from '@/lib/hooks/useAuth';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === post.user_id;

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleDelete = () => {
    if (confirm('确定要删除这条帖子吗？')) {
      deletePost(post.id);
    }
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user_id}`}>
            <Avatar src={post.user.avatar} size="md" />
          </Link>
          <div>
            <Link href={`/profile/${post.user_id}`}>
              <p className="font-semibold text-gray-900 dark:text-white hover:underline">
                {post.user.profile?.nickname || post.user.username}
              </p>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(post.created_at)}</span>
              {post.group && (
                <>
                  <span>·</span>
                  <Link href={`/groups/${post.group_id}`} className="hover:underline">
                    {post.group.name}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={cn(
          'grid gap-2 mb-3',
          post.images.length === 1 && 'grid-cols-1',
          post.images.length === 2 && 'grid-cols-2',
          post.images.length >= 3 && 'grid-cols-3'
        )}>
          {post.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 py-2 border-t border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <span>{post.like_count} 赞</span>
        <span>{post.comment_count} 评论</span>
        <span>{post.share_count} 分享</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            'flex-1',
            post.is_liked && 'text-primary-700 dark:text-primary-400'
          )}
        >
          <Heart className={cn('h-5 w-5 mr-2', post.is_liked && 'fill-current')} />
          {post.is_liked ? '已赞' : '点赞'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex-1"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          评论
        </Button>
        
        <Button variant="ghost" size="sm" className="flex-1">
          <Share2 className="h-5 w-5 mr-2" />
          分享
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">评论功能开发中...</p>
        </div>
      )}
    </Card>
  );
}
