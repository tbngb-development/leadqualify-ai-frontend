// src/hooks/useDashboard.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

export const DASHBOARD_KEY = ['dashboard'] as const;

export function useDashboardOverview() {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, 'overview'],
    queryFn: dashboardApi.getOverview,
    refetchInterval: 30000, // refresh every 30s
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, 'activity'],
    queryFn: dashboardApi.getActivity,
    refetchInterval: 15000,
  });
}

export function useDashboardCampaigns() {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, 'campaigns'],
    queryFn: dashboardApi.getCampaigns,
    refetchInterval: 15000,
  });
}