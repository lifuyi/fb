'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { useGroups } from '@/lib/hooks/useGroups';

const createGroupSchema = z.object({
  name: z.string().min(2, '群组名称至少2个字符').max(50, '群组名称最多50个字符'),
  description: z.string().max(500, '群组描述最多500个字符').optional(),
  type: z.enum(['public', 'private']),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { createGroup, isCreatingGroup } = useGroups();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      type: 'public',
    },
  });

  const groupType = watch('type');

  const onSubmit = (data: CreateGroupFormData) => {
    createGroup({
      ...data,
      type: data.type === 'public' ? 0 : 1, // Convert to integer: 0=public, 1=private
    }, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="创建群组" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="群组名称"
          placeholder="输入群组名称"
          error={errors.name?.message}
          {...register('name')}
        />

        <Textarea
          label="群组描述"
          placeholder="简单介绍一下这个群组"
          error={errors.description?.message}
          rows={4}
          {...register('description')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            群组类型
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="radio"
                value="public"
                {...register('type')}
                className="text-primary-700 focus:ring-primary-700"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">公开群组</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">任何人都可以加入</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="radio"
                value="private"
                {...register('type')}
                className="text-primary-700 focus:ring-primary-700"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">私密群组</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">需要邀请才能加入</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={isCreatingGroup}
          >
            创建群组
          </Button>
        </div>
      </form>
    </Modal>
  );
}
