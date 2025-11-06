'use client';

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePosts } from '@/lib/hooks/usePosts';

interface CreatePostProps {
  groupId?: number;
}

export default function CreatePost({ groupId }: CreatePostProps) {
  const { user } = useAuth();
  const { createPost, isCreatingPost } = usePosts(groupId);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    createPost({
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      group_id: groupId,
      type: images.length > 0 ? 'image' : 'text',
    });

    setContent('');
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // TODO: Implement actual image upload to OSS
    // For now, just show placeholder
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages].slice(0, 9)); // Max 9 images
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-3">
        <Avatar src={user?.avatar} size="md" />
        
        <div className="flex-1">
          <Textarea
            placeholder="分享你的想法..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-3 resize-none"
            rows={3}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <ImageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 9}
                />
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isCreatingPost}
              isLoading={isCreatingPost}
            >
              发布
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
