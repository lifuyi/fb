import { apiClient } from '../api';
import { ProfileData, UpdateProfileData, Post, Group } from '../types';

interface PaginatedData<T> {
  list: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

export const profileService = {
  // Get current user profile
  getCurrentProfile: async (): Promise<ProfileData> => {
    const response = await apiClient.get('/profile');
    return response.data.data;
  },

  // Get specific user profile
  getUserProfile: async (userId: number): Promise<ProfileData> => {
    const response = await apiClient.get(`/profile/${userId}`);
    return response.data.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<any> => {
    const response = await apiClient.put('/profile', data);
    return response.data.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get current user's posts
  getCurrentUserPosts: async (page = 1, size = 10): Promise<PaginatedData<Post>> => {
    const response = await apiClient.get('/profile/posts', {
      params: { page, size },
    });
    return response.data.data;
  },

  // Get specific user's posts
  getUserPosts: async (userId: number, page = 1, size = 10): Promise<PaginatedData<Post>> => {
    const response = await apiClient.get(`/profile/${userId}/posts`, {
      params: { page, size },
    });
    return response.data.data;
  },

  // Get current user's groups
  getCurrentUserGroups: async (page = 1, size = 10): Promise<PaginatedData<Group>> => {
    const response = await apiClient.get('/profile/groups', {
      params: { page, size },
    });
    return response.data.data;
  },

  // Get specific user's groups
  getUserGroups: async (userId: number, page = 1, size = 10): Promise<PaginatedData<Group>> => {
    const response = await apiClient.get(`/profile/${userId}/groups`, {
      params: { page, size },
    });
    return response.data.data;
  },

  // Update email
  updateEmail: async (email: string, password: string): Promise<void> => {
    await apiClient.put('/profile/email', { email, password });
  },

  // Update phone
  updatePhone: async (phone: string, code: string): Promise<void> => {
    await apiClient.put('/profile/phone', { phone, code });
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<void> => {
    await apiClient.put('/profile/password', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
  },
};
