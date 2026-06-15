// src/lib/api/tenants.ts

import apiClient from '@/lib/axios';
import type { ApiResponse, Tenant, TenantStats } from '@/types';

export const tenantsApi = {
  getAll: async (): Promise<Tenant[]> => {
    const res = await apiClient.get<ApiResponse<Tenant[]>>('/api/tenants');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch tenants');
    }
    return res.data.data;
  },

  getById: async (id: string): Promise<Tenant> => {
    const res = await apiClient.get<ApiResponse<Tenant>>(
      `/api/tenants/${id}`
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch tenant');
    }
    return res.data.data;
  },

  update: async (
    id: string,
    data: Partial<Pick<Tenant, 'isActive' | 'name'>>
  ): Promise<Tenant> => {
    const res = await apiClient.patch<ApiResponse<Tenant>>(
      `/api/tenants/${id}`,
      data
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to update tenant');
    }
    return res.data.data;
  },

  getStats: async (id: string): Promise<TenantStats> => {
    const res = await apiClient.get<ApiResponse<TenantStats>>(
      `/api/tenants/${id}/stats`
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? 'Failed to fetch tenant stats');
    }
    return res.data.data;
  },
};