// src/components/campaigns/CampaignStats.tsx

import { Card } from '@/components/ui/Card';
import type { Campaign } from '@/types';

interface CampaignStatsProps {
  campaign: Campaign;
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  const completionPct =
    campaign.totalLeads > 0
      ? Math.round((campaign.calledLeads / campaign.totalLeads) * 100)
      : 0;

  const successRate =
    campaign.calledLeads > 0
      ? Math.round((campaign.successLeads / campaign.calledLeads) * 100)
      : 0;

  const stats = [
    {
      label: 'Total Leads',
      value: campaign.totalLeads,
      color: 'text-text-primary',
    },
    {
      label: 'Called',
      value: campaign.calledLeads,
      color: 'text-info-600',
    },
    {
      label: 'Qualified',
      value: campaign.successLeads,
      color: 'text-success-600',
    },
    {
      label: 'Failed',
      value: campaign.failedLeads,
      color: 'text-error-600',
    },
  ];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Campaign Statistics
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Progress</span>
          <span>{completionPct}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted mt-1">
          <span>Success rate</span>
          <span className="text-success-600 font-medium">
            {successRate}% of called leads
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full rounded-full bg-success-500 transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>
    </Card>
  );
}