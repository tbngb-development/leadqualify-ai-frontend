// src/hooks/useAssistants.ts

'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { assistantsApi } from '@/lib/api/assistants';
import type { CreateAssistantInput, UpdateAssistantInput } from '@/types';

export const ASSISTANTS_KEY = ['assistants'] as const;

export function useAssistants() {
  return useQuery({
    queryKey: ASSISTANTS_KEY,
    queryFn: assistantsApi.getAll,
  });
}

export function useAssistant(id: string) {
  return useQuery({
    queryKey: [...ASSISTANTS_KEY, id],
    queryFn: () => assistantsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAssistant() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssistantInput) => assistantsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSISTANTS_KEY });
      toast.success('Assistant created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateAssistant(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAssistantInput) =>
      assistantsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSISTANTS_KEY });
      toast.success('Assistant updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAssistant() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assistantsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSISTANTS_KEY });
      toast.success('Assistant deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}