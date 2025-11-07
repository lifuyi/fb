import { apiClient } from '../api';
import { User } from '../types';

interface PaginatedData<T> {
  list: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

export const followService = {
  // Follow a user
  follow: async (userId: number): Promise<void> => {
    await apiClient.post(`/follow/${userId}`);
  },

  // Unfollow a user
  unfollow: async (userId: number): Promise<void> => {
    await apiClient.delete(`/follow/${userId}`);
  },

  // Get following list
  getFollowing: async (userId?: number, page = 1, size = 20): Promise<PaginatedData<User>> => {
    const url = userId ? `/follow/following/${userId}` : '/follow/following';
    const response = await apiClient.get(url, {
      params: { page, size },
    });
    return response.data.data;
  },

  // Get followers list
  getFollowers: async (userId?: number, page = 1, size = 20): Promise<PaginatedData<User>> => {
    const url = userId ? `/follow/followers/${userId}` : '/follow/followers';
    const response = await apiClient.get(url, {
      params: { page, size },
    });
    return response.data.data;
  },

  // Check follow status
  checkFollowStatus: async (userId: number): Promise<boolean> => {
    const response = await apiClient.get(`/follow/status/${userId}`);
    return response.data.data.is_following;
  },
};
