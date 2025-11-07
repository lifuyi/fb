import { apiClient, ApiResponse, PaginatedResponse } from '../api';
import { Group, GroupMember } from '../types';

export interface CreateGroupData {
  name: string;
  description?: string;
  avatar?: string;
  type: 0 | 1 | 2; // 0: public, 1: private, 2: secret
}

export const groupService = {
  // Get groups list
  async getGroups(page: number = 1): Promise<PaginatedResponse<Group>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Group>>>(
      '/groups',
      { params: { page } }
    );
    return data.data;
  },

  // Get single group
  async getGroup(id: number): Promise<Group> {
    const { data } = await apiClient.get<ApiResponse<Group>>(`/groups/${id}`);
    return data.data;
  },

  // Create group
  async createGroup(groupData: CreateGroupData): Promise<Group> {
    const { data } = await apiClient.post<ApiResponse<Group>>('/groups', groupData);
    return data.data;
  },

  // Update group
  async updateGroup(id: number, groupData: Partial<CreateGroupData>): Promise<Group> {
    const { data } = await apiClient.put<ApiResponse<Group>>(
      `/groups/${id}`,
      groupData
    );
    return data.data;
  },

  // Delete group
  async deleteGroup(id: number): Promise<void> {
    await apiClient.delete(`/groups/${id}`);
  },

  // Join group
  async joinGroup(id: number): Promise<void> {
    await apiClient.post(`/groups/${id}/join`);
  },

  // Leave group
  async leaveGroup(id: number): Promise<void> {
    await apiClient.post(`/groups/${id}/leave`);
  },

  // Get group members
  async getMembers(id: number): Promise<GroupMember[]> {
    const { data } = await apiClient.get<ApiResponse<GroupMember[]>>(
      `/groups/${id}/members`
    );
    return data.data;
  },

  // Remove member
  async removeMember(groupId: number, userId: number): Promise<void> {
    await apiClient.delete(`/groups/${groupId}/members/${userId}`);
  },

  // Set member role
  async setMemberRole(
    groupId: number,
    userId: number,
    role: 'admin' | 'member'
  ): Promise<void> {
    await apiClient.put(`/groups/${groupId}/members/${userId}/role`, { role });
  },
};
