// src/hooks/useTenants.ts

'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { tenantsApi } from '@/lib/api/tenants';

export const TENANTS_KEY = ['tenants'] as const;

export function useTenants() {
  return useQuery({
    queryKey: TENANTS_KEY,
    queryFn: tenantsApi.getAll,
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: [...TENANTS_KEY, id],
    queryFn: () => tenantsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useTenantStats(id: string) {
  return useQuery({
    queryKey: [...TENANTS_KEY, id, 'stats'],
    queryFn: () => tenantsApi.getStats(id),
    enabled: Boolean(id),
  });
}

export function useToggleTenantStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) => tenantsApi.update(id, { isActive }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast.success(
        `Tenant ${data.isActive ? 'activated' : 'deactivated'} successfully`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}