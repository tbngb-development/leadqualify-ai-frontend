// src/hooks/useLeads.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '@/lib/api/leads';
import type { LeadQueryParams } from '@/types';

export const LEADS_KEY = ['leads'] as const;

export function useLeads(params: LeadQueryParams = {}) {
  return useQuery({
    queryKey: [...LEADS_KEY, params],
    queryFn: () => leadsApi.getAll(params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [...LEADS_KEY, id],
    queryFn: () => leadsApi.getById(id),
    enabled: Boolean(id),
  });
}