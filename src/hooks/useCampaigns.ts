// src/hooks/useCampaigns.ts

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { campaignsApi } from "@/lib/api/campaigns";
import type { CreateCampaignInput, UpdateCampaignInput, UploadResult } from "@/types";

export const CAMPAIGNS_KEY = ["campaigns"] as const;

export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGNS_KEY,
    queryFn: campaignsApi.getAll,
  });
}

export function useCampaign(id: string, pollWhileRunning = false) {
  return useQuery({
    queryKey: [...CAMPAIGNS_KEY, id],
    queryFn: () => campaignsApi.getById(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      if (!pollWhileRunning) return false;
      const status = query.state.data?.status;
      return status === "RUNNING" ? 5000 : false;
    },
  });
}

export function useCampaignStats(id: string, pollWhileRunning = false) {
  return useQuery({
    queryKey: [...CAMPAIGNS_KEY, id, "stats"],
    queryFn: () => campaignsApi.getStats(id),
    enabled: Boolean(id),
    refetchInterval: pollWhileRunning ? 5000 : false,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignInput) => campaignsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      toast.success("Campaign created successfully!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateCampaign(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCampaignInput) => campaignsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      toast.success("Campaign updated successfully!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUploadCSV(campaignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => campaignsApi.uploadCSV(campaignId, file),
    onSuccess: (result: UploadResult) => {
      qc.invalidateQueries({ queryKey: [...CAMPAIGNS_KEY, campaignId] });

      // ── Primary success message ───────────────────────────────────────────
      if (result.imported > 0) {
        toast.success(
          `${result.imported} lead${result.imported !== 1 ? "s" : ""} imported successfully.`
        );
      }

      // ── Duplicate warning ─────────────────────────────────────────────────
      if (result.duplicates > 0) {
        toast.warning(
          `${result.duplicates} duplicate${result.duplicates !== 1 ? "s" : ""} skipped — already in this campaign.`
        );
      }

      // ── Invalid rows warning ──────────────────────────────────────────────
      if (result.invalid > 0) {
        toast.warning(
          `${result.invalid} row${result.invalid !== 1 ? "s" : ""} skipped — missing phone number.`
        );
      }

      // ── Edge case: nothing imported ───────────────────────────────────────
      if (result.imported === 0) {
        toast.error("No new leads were imported.");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useStartCampaign(campaignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => campaignsApi.start(campaignId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      toast.success("Campaign started!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePauseCampaign(campaignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => campaignsApi.pause(campaignId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      toast.success("Campaign paused!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}