// src/components/campaigns/CampaignProgressBar.tsx

"use client";

import type { CampaignDetail } from "@/mocks/campaign-detail";

interface CampaignProgressBarProps {
  campaign: CampaignDetail;
}

export default function CampaignProgressBar({
  campaign,
}: CampaignProgressBarProps) {
  const {
    total_leads,
    calls_completed,
    calls_failed,
    calls_pending,
    calls_initiated,
  } = campaign;

  const completedPct = total_leads > 0
    ? Math.round((calls_completed / total_leads) * 100)
    : 0;
  const failedPct = total_leads > 0
    ? Math.round((calls_failed / total_leads) * 100)
    : 0;
  const callingPct = total_leads > 0
    ? Math.round(
        ((calls_initiated - calls_completed - calls_failed) / total_leads) *
          100
      )
    : 0;
  const overallPct = total_leads > 0
    ? Math.round(((calls_completed + calls_failed) / total_leads) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            Campaign Progress
          </span>
          <span className="text-xs text-text-muted">
            ({calls_completed + calls_failed} of {total_leads} processed)
          </span>
        </div>
        <span className="text-lg font-bold text-brand-600 tabular-nums">
          {overallPct}%
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="h-3 bg-surface-subtle rounded-full overflow-hidden flex">
        {/* Completed */}
        <div
          className="h-full bg-success-500 transition-all duration-700 ease-out"
          style={{ width: `${completedPct}%` }}
        />
        {/* Currently calling */}
        {callingPct > 0 && (
          <div
            className="h-full bg-brand-400 animate-pulse transition-all duration-700 ease-out"
            style={{ width: `${Math.max(callingPct, 1)}%` }}
          />
        )}
        {/* Failed */}
        <div
          className="h-full bg-error-400 transition-all duration-700 ease-out"
          style={{ width: `${failedPct}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 flex-wrap">
        <LegendItem
          color="bg-success-500"
          label="Completed"
          value={calls_completed}
          pct={completedPct}
        />
        <LegendItem
          color="bg-brand-400"
          label="In Progress"
          value={Math.max(calls_initiated - calls_completed - calls_failed, 0)}
          pct={callingPct}
          pulse
        />
        <LegendItem
          color="bg-error-400"
          label="Failed"
          value={calls_failed}
          pct={failedPct}
        />
        <LegendItem
          color="bg-surface-subtle"
          label="Pending"
          value={calls_pending}
          pct={100 - completedPct - failedPct - callingPct}
        />
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
  pct,
  pulse = false,
}: {
  color: string;
  label: string;
  value: number;
  pct: number;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${color} ${
          pulse ? "animate-pulse" : ""
        }`}
      />
      <span className="text-xs text-text-muted">
        {label}:{" "}
        <span className="font-semibold text-text-secondary tabular-nums">
          {value.toLocaleString()}
        </span>{" "}
        <span className="text-text-placeholder">({pct}%)</span>
      </span>
    </div>
  );
}