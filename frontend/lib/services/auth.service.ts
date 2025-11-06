import { apiClient, ApiResponse } from '../api';
import { AuthResponse, LoginCredentials, User } from '../types';

export const authService = {
  // WeChat login (placeholder until credentials available)
  async wechatLogin(code: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/wechat-login',
      { code }
    );
    return data.data;
  },

  // Phone login with SMS code
  async phoneLogin(phone: string, code: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/phone-login',
      { phone, code }
    );
    return data.data;
  },

  // Email login
  async emailLogin(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/email-login',
      { email, password }
    );
    return data.data;
  },

  // Send SMS code
  async sendSmsCode(phone: string): Promise<void> {
    await apiClient.post('/auth/send-sms-code', { phone });
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/user');
    return data.data;
  },

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const { data } = await apiClient.put<ApiResponse<User>>(
      '/auth/profile',
      profileData
    );
    return data.data;
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const { data } = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/refresh-token'
    );
    return data.data.token;
  },

  // Email registration
  async emailRegister(email: string, password: string, password_confirmation: string, nickname: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/email-register',
      { email, password, password_confirmation, nickname }
    );
    return data.data;
  },

  // Phone registration
  async phoneRegister(phone: string, code: string, nickname: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/phone-register',
      { phone, code, nickname }
    );
    return data.data;
  },
};
