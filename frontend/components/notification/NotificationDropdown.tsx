import { useState } from 'react';
import { CheckCheck, Trash2, X } from 'lucide-react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { notificationService } from '@/lib/services/notification.service';
import { Notification } from '@/lib/types';
import Button from '@/components/ui/Button';

interface NotificationDropdownProps {
  onClose: () => void;
  onUpdate: () => void;
}

export default function NotificationDropdown({ onClose, onUpdate }: NotificationDropdownProps) {
  const { notifications, isLoading, refetch } = useNotifications(1, 10);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const getNotificationIcon = (type: number) => {
    switch (type) {
      case 1: return '👍';
      case 2: return '💬';
      case 3: return '👤';
      case 4: return '📢';
      default: return '📬';
    }
  };

  const handleMarkAsRead = async (id: number) => {
    setActionLoading(id);
    try {
      await notificationService.markAsRead(id);
      await refetch();
      onUpdate();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(id);
    try {
      await notificationService.deleteNotification(id);
      await refetch();
      onUpdate();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await refetch();
      onUpdate();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">通知</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            全部已读
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            暂无通知
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.is_read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={actionLoading === notification.id}
                        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        title="标记已读"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      disabled={actionLoading === notification.id}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          查看全部通知
        </button>
      </div>
    </div>
  );
}
