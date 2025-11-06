import { apiClient, ApiResponse, PaginatedResponse } from '../api';
import { Post, Comment } from '../types';

export interface CreatePostData {
  content: string;
  images?: string[];
  group_id?: number;
  type?: 'text' | 'image';
}

export interface CreateCommentData {
  content: string;
  parent_id?: number;
}

export const postService = {
  // Get posts feed
  async getFeed(page: number = 1, groupId?: number): Promise<PaginatedResponse<Post>> {
    const params: any = { page };
    if (groupId) params.group_id = groupId;
    
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      '/posts',
      { params }
    );
    return data.data;
  },

  // Get single post
  async getPost(id: number): Promise<Post> {
    const { data } = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.data;
  },

  // Create post
  async createPost(postData: CreatePostData): Promise<Post> {
    const { data } = await apiClient.post<ApiResponse<Post>>('/posts', postData);
    return data.data;
  },

  // Delete post
  async deletePost(id: number): Promise<void> {
    await apiClient.delete(`/posts/${id}`);
  },

  // Like/unlike post
  async toggleLike(id: number): Promise<void> {
    await apiClient.post(`/posts/${id}/like`);
  },

  // Add comment
  async addComment(postId: number, commentData: CreateCommentData): Promise<Comment> {
    const { data } = await apiClient.post<ApiResponse<Comment>>(
      `/posts/${postId}/comments`,
      commentData
    );
    return data.data;
  },

  // Delete comment
  async deleteComment(postId: number, commentId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
  },

  // Like/unlike comment
  async toggleCommentLike(postId: number, commentId: number): Promise<void> {
    await apiClient.post(`/posts/${postId}/comments/${commentId}/like`);
  },

  // Report post
  async reportPost(id: number, reason: string): Promise<void> {
    await apiClient.post(`/posts/${id}/report`, { reason });
  },

  // Pin/unpin post (admin)
  async togglePin(id: number): Promise<void> {
    await apiClient.post(`/posts/${id}/pin`);
  },
};
