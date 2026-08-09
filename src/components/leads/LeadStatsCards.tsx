// src/components/leads/LeadStatsCards.tsx

import type { LeadStats } from "@/types";
import { Users, Clock, PhoneOff, Target, Ban } from "lucide-react";

interface LeadStatsCardsProps {
  stats: LeadStats;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="bg-surface rounded-lg border border-surface-border p-4 flex items-start gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${iconClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted font-medium">{label}</p>
        <p className="text-xl font-bold text-text-primary mt-0.5">{value}</p>
        {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function LeadStatsCards({ stats }: LeadStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Total Leads"
        value={stats.total}
        icon={<Users size={16} />}
        iconClass="bg-brand-100 text-brand-600"
      />
      <StatCard
        label="Pending"
        value={stats.pending}
        icon={<Clock size={16} />}
        iconClass="bg-surface-subtle text-text-muted"
      />
      <StatCard
        label="Called"
        value={stats.called}
        sub={`${stats.total > 0 ? ((stats.called / stats.total) * 100).toFixed(0) : 0}%`}
        icon={<Users size={16} />}
        iconClass="bg-info-100 text-info-600"
      />
      <StatCard
        label="Qualified"
        value={stats.qualified}
        sub={stats.qualificationRate}
        icon={<Target size={16} />}
        iconClass="bg-success-100 text-success-600"
      />
      <StatCard
        label="No Answer"
        value={stats.noAnswer}
        icon={<PhoneOff size={16} />}
        iconClass="bg-warning-100 text-warning-600"
      />
      <StatCard
        label="Do Not Call"
        value={stats.doNotCall}
        icon={<Ban size={16} />}
        iconClass="bg-error-100 text-error-600"
      />
    </div>
  );
}