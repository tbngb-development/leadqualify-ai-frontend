// src/components/calls/CallStatsCards.tsx

import type { CallStats } from "@/types";
import { Phone, CheckCircle, XCircle, Clock, Thermometer, Target } from "lucide-react";
import { formatDuration } from "@/lib/utils/formatDuration";

interface CallStatsCardsProps {
  stats: CallStats;
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

export function CallStatsCards({ stats }: CallStatsCardsProps) {
  const hotWarm =
    (stats.temperatureBreakdown["HOT"] ?? 0) +
    (stats.temperatureBreakdown["WARM"] ?? 0);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Primary stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total Calls"
          value={stats.total}
          icon={<Phone size={16} />}
          iconClass="bg-brand-100 text-brand-600"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          sub={`${stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0}%`}
          icon={<CheckCircle size={16} />}
          iconClass="bg-success-100 text-success-600"
        />
        <StatCard
          label="Qualified"
          value={stats.qualifiedCount}
          sub={stats.qualificationRate}
          icon={<Target size={16} />}
          iconClass="bg-info-100 text-info-600"
        />
        <StatCard
          label="No Answer"
          value={stats.noAnswer}
          icon={<XCircle size={16} />}
          iconClass="bg-warning-100 text-warning-600"
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          icon={<XCircle size={16} />}
          iconClass="bg-error-100 text-error-600"
        />
        <StatCard
          label="Avg Duration"
          value={formatDuration(stats.avgDuration)}
          icon={<Clock size={16} />}
          iconClass="bg-secondary-50 text-secondary-600"
        />
      </div>

      {/* ── Temperature breakdown ─────────────────────────────────────────── */}
      {Object.keys(stats.temperatureBreakdown).length > 0 && (
        <div className="bg-surface rounded-lg border border-surface-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer size={14} className="text-text-muted" />
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Lead Temperature
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {(["HOT", "WARM", "NURTURE", "COLD", "NOT_APPLICABLE"] as const).map(
              (temp) => {
                const count = stats.temperatureBreakdown[temp] ?? 0;
                if (count === 0) return null;
                const colorMap: Record<string, string> = {
                  HOT: "bg-error-100 text-error-700",
                  WARM: "bg-warning-100 text-warning-700",
                  NURTURE: "bg-info-100 text-info-700",
                  COLD: "bg-surface-subtle text-text-muted",
                  NOT_APPLICABLE: "bg-surface-subtle text-text-muted",
                };
                return (
                  <div key={temp} className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[temp]}`}
                    >
                      {temp}
                    </span>
                    <span className="text-sm font-semibold text-text-primary">
                      {count}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}