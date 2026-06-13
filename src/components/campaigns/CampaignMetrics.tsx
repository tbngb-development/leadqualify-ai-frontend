// src/components/campaigns/CampaignMetrics.tsx

"use client";

import { PhoneCall, PhoneOff, Clock, Users, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import type { CampaignDetail } from "@/mocks/campaign-detail";

interface CampaignMetricsProps {
  campaign: CampaignDetail;
}

interface MetricCardProps {
  label: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  suffix?: string;
}

function MetricCard({
  label,
  value,
  total,
  icon,
  iconBg,
  iconColor,
  suffix,
}: MetricCardProps) {
  return (
    <Card hover>
      <div className="flex items-center gap-3.5">
        <div
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-xl shrink-0
            ${iconBg} ${iconColor}
          `}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold text-text-primary tabular-nums">
              {value.toLocaleString()}
            </span>
            {total !== undefined && (
              <span className="text-xs text-text-muted">
                / {total.toLocaleString()}
              </span>
            )}
            {suffix && (
              <span className="text-xs text-text-muted">{suffix}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function CampaignMetrics({ campaign }: CampaignMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <MetricCard
        label="Total Leads"
        value={campaign.total_leads}
        icon={<Users className="w-5 h-5" />}
        iconBg="bg-info-50"
        iconColor="text-info-600"
      />
      <MetricCard
        label="Completed"
        value={campaign.calls_completed}
        total={campaign.total_leads}
        icon={<PhoneCall className="w-5 h-5" />}
        iconBg="bg-success-50"
        iconColor="text-success-600"
      />
      <MetricCard
        label="Pending"
        value={campaign.calls_pending}
        icon={<Clock className="w-5 h-5" />}
        iconBg="bg-warning-50"
        iconColor="text-warning-600"
      />
      <MetricCard
        label="Failed"
        value={campaign.calls_failed}
        icon={<PhoneOff className="w-5 h-5" />}
        iconBg="bg-error-50"
        iconColor="text-error-600"
      />
      <MetricCard
        label="Avg Duration"
        value={campaign.avg_call_duration}
        icon={<TrendingUp className="w-5 h-5" />}
        iconBg="bg-brand-50"
        iconColor="text-brand-500"
        suffix={`(${formatDuration(campaign.avg_call_duration)})`}
      />
    </div>
  );
}