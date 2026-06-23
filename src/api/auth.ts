import apiClient from '../utils/axios';
import { ChangePasswordPayload, UpdateProfilePayload, User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/teacher/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/v1/teacher/logout');
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>('/api/v1/teacher/profile');
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse> {
    const response = await apiClient.put<ProfileResponse>('/api/v1/teacher/profile', payload);
    return response.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      '/api/v1/teacher/change-password',
      payload
    );
    return response.data;
  },
};
