// src/lib/api/assistants.ts

import apiClient from '@/lib/axios';
import type {
  ApiResponse,
  Assistant,
  CreateAssistantInput,
  UpdateAssistantInput,
} from '@/types';

export const assistantsApi = {
  getAll: async (): Promise<Assistant[]> => {
    const res = await apiClient.get<ApiResponse<Assistant[]>>(
      '/api/assistants'
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch assistants');
    }
    return res.data.data;
  },

  getById: async (id: string): Promise<Assistant> => {
    const res = await apiClient.get<ApiResponse<Assistant>>(
      `/api/assistants/${id}`
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch assistant');
    }
    return res.data.data;
  },

  create: async (data: CreateAssistantInput): Promise<Assistant> => {
    const res = await apiClient.post<ApiResponse<Assistant>>(
      '/api/assistants',
      data
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to create assistant');
    }
    return res.data.data;
  },

  update: async (
    id: string,
    data: UpdateAssistantInput
  ): Promise<Assistant> => {
    const res = await apiClient.patch<ApiResponse<Assistant>>(
      `/api/assistants/${id}`,
      data
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to update assistant');
    }
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const res = await apiClient.delete<ApiResponse<null>>(
      `/api/assistants/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.error ?? 'Failed to delete assistant');
    }
  },
};