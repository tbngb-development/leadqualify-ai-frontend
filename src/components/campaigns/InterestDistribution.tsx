// src/components/campaigns/InterestDistribution.tsx

"use client";

import { Flame, Sun, Snowflake, ThumbsDown } from "lucide-react";
import Card from "@/components/ui/Card";

interface InterestDistributionProps {
  summary: {
    hot: number;
    warm: number;
    cold: number;
    not_interested: number;
  };
  totalCompleted: number;
}

interface DistributionItemProps {
  label: string;
  count: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  barColor: string;
}

function DistributionItem({
  label,
  count,
  total,
  icon,
  color,
  barColor,
}: DistributionItemProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-sm font-medium text-text-primary">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-primary tabular-nums">
            {count}
          </span>
          <span className="text-xs text-text-muted tabular-nums">({pct}%)</span>
        </div>
      </div>
      <div className="h-2 bg-surface-subtle rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function InterestDistribution({
  summary,
  totalCompleted,
}: InterestDistributionProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Interest Distribution
      </h3>
      <div className="space-y-4">
        <DistributionItem
          label="Hot"
          count={summary.hot}
          total={totalCompleted}
          icon={<Flame className="w-4 h-4" />}
          color="text-error-500"
          barColor="bg-error-500"
        />
        <DistributionItem
          label="Warm"
          count={summary.warm}
          total={totalCompleted}
          icon={<Sun className="w-4 h-4" />}
          color="text-warning-500"
          barColor="bg-warning-500"
        />
        <DistributionItem
          label="Cold"
          count={summary.cold}
          total={totalCompleted}
          icon={<Snowflake className="w-4 h-4" />}
          color="text-info-500"
          barColor="bg-info-500"
        />
        <DistributionItem
          label="Not Interested"
          count={summary.not_interested}
          total={totalCompleted}
          icon={<ThumbsDown className="w-4 h-4" />}
          color="text-text-muted"
          barColor="bg-surface-border"
        />
      </div>
    </Card>
  );
}