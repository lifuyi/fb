import { apiClient } from '../api';
import { Notification } from '../types';

interface PaginatedData<T> {
  list: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

export const notificationService = {
  // Get notifications
  getNotifications: async (page = 1, size = 20, type?: number, isRead?: boolean): Promise<PaginatedData<Notification>> => {
    const response = await apiClient.get('/notifications', {
      params: { page, size, type, is_read: isRead },
    });
    return response.data.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data.unread_count;
  },

  // Mark as read
  markAsRead: async (id: number): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Clear read notifications
  clearRead: async (): Promise<void> => {
    await apiClient.delete('/notifications/clear-read');
  },
};
