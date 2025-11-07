'use client';

import { useState } from 'react';
import { Settings, Edit2, Trash2, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { Group } from '@/lib/types';
import { useGroups } from '@/lib/hooks/useGroups';

interface GroupSettingsModalProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupSettingsModal({ group, isOpen, onClose }: GroupSettingsModalProps) {
  const { updateGroup, deleteGroup } = useGroups();
  const [activeTab, setActiveTab] = useState<'edit' | 'danger'>('edit');
  const [editForm, setEditForm] = useState({
    name: group.name || '',
    description: group.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateGroup(group.id, editForm);
      onClose();
    } catch (error) {
      console.error('Failed to update group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!group.name) return;
    
    const confirmText = window.prompt(
      `确定要删除群组"${group.name}"吗？此操作不可撤销。请输入群组名称确认：`
    );
    
    if (confirmText !== group.name) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteGroup(group.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            群组设置
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'text-primary-700 border-b-2 border-primary-700 dark:text-primary-400 dark:border-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit2 className="h-4 w-4 inline mr-2" />
            编辑信息
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'danger'
                ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400 dark:border-red-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('danger')}
          >
            <Trash2 className="h-4 w-4 inline mr-2" />
            危险操作
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'edit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  群组名称
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="输入群组名称"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  群组描述
                </label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="简单介绍一下这个群组"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !editForm.name.trim()}
                >
                  {isSubmitting ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                  删除群组
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  删除群组后将无法恢复，所有群组内容（包括帖子、成员列表等）都将被永久删除。
                  请谨慎操作。
                </p>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? '删除中...' : '删除群组'}
                </Button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>• 只有群主可以删除群组</p>
                <p>• 删除后群组ID将被释放，无法恢复</p>
                <p>• 所有成员将被移出群组</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}