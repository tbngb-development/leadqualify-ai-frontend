// src/components/dashboard/ActivityFeed.tsx

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatRelative } from '@/lib/utils/formatDate';
import type { ActivityItem } from '@/types';
import { Phone, Target, UserCheck, Zap } from 'lucide-react';

const iconMap = {
  call_completed: Phone,
  lead_qualified: UserCheck,
  campaign_started: Zap,
  campaign_completed: Target,
};

const colorMap = {
  call_completed: 'bg-info-100 text-info-600',
  lead_qualified: 'bg-success-100 text-success-600',
  campaign_started: 'bg-brand-100 text-brand-600',
  campaign_completed: 'bg-secondary-50 text-secondary-600',
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card padding="none">
      <CardHeader className="px-5 pt-5">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <div className="divide-y divide-surface-border">
        {items.slice(0, 8).map((item) => {
          const Icon = iconMap[item.type] ?? Zap;
          const color = colorMap[item.type] ?? 'bg-surface-subtle text-text-muted';
          return (
            <div key={item.id} className="flex items-start gap-3 px-5 py-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full shrink-0 ${color}`}
              >
                <Icon size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary">{item.message}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {formatRelative(item.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}