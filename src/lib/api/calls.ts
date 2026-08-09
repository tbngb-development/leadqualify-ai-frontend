// src/lib/api/calls.ts

import apiClient from "@/lib/axios";
import type {
  ApiResponse,
  Call,
  CallQueryParams,
  CallStats,
  CallTranscriptResponse,
  PaginatedData,
  PaginatedResponse,
} from "@/types";

export const callsApi = {
  getAll: async (params: CallQueryParams = {}): Promise<PaginatedData<Call>> => {
    const res = await apiClient.get<PaginatedResponse<Call>>("/api/calls", {
      params,
    });
    if (!res.data.success || !res.data.data) {
      throw new Error("Failed to fetch calls");
    }
    return res.data.data;
  },

  getById: async (id: string): Promise<Call> => {
    const res = await apiClient.get<ApiResponse<Call>>(`/api/calls/${id}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? "Failed to fetch call");
    }
    return res.data.data;
  },

  getTranscript: async (id: string): Promise<CallTranscriptResponse> => {
    const res = await apiClient.get<ApiResponse<CallTranscriptResponse>>(
      `/api/calls/${id}/transcript`
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? "Failed to fetch transcript");
    }
    return res.data.data;
  },

  getStats: async (params: {
    campaignId?: string;
    leadId?: string;
  }): Promise<CallStats> => {
    const res = await apiClient.get<ApiResponse<CallStats>>(
      "/api/calls/stats",
      { params }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error ?? "Failed to fetch call stats");
    }
    return res.data.data;
  },
};