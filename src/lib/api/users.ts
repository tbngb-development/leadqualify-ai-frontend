// src/lib/api/users.ts

import apiClient from '@/lib/axios';
import type {
  ApiResponse,
  CreateUserInput,
  UpdateUserInput,
  User,
} from '@/types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/api/users');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch users');
    }
    return res.data.data;
  },

  create: async (data: CreateUserInput): Promise<User> => {
    const res = await apiClient.post<ApiResponse<User>>('/api/users', data);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to create user');
    }
    return res.data.data;
  },

  update: async (id: string, data: UpdateUserInput): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>(
      `/api/users/${id}`,
      data
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to update user');
    }
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/api/users/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.error ?? 'Failed to delete user');
    }
  },
};