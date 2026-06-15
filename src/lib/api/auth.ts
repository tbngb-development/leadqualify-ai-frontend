// src/lib/api/auth.ts

import apiClient from '@/lib/axios';
import type {
  ApiResponse,
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '@/types';

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/login',
      data
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? res.data.message ?? 'Login failed');
    }
    return res.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/register',
      data
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(
        res.data.error ?? res.data.message ?? 'Registration failed'
      );
    }
    return res.data.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/api/auth/profile');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch profile');
    }
    return res.data.data;
  },
};