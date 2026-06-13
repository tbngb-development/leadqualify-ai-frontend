// src/components/leads/LeadSummaryCards.tsx

"use client";

import { Users, UserCheck, UserX } from "lucide-react";
import Card from "@/components/ui/Card";

interface LeadSummaryCardsProps {
  total: number;
  valid: number;
  invalid: number;
}

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent?: string;
}

function StatItem({ label, value, icon, iconBg, iconColor, accent }: StatItemProps) {
  return (
    <Card hover>
      <div className="flex items-center gap-4">
        <div
          className={`
            flex items-center justify-center
            w-11 h-11 rounded-xl shrink-0
            ${iconBg} ${iconColor}
          `}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
            {label}
          </p>
          <p className={`text-2xl font-bold tracking-tight mt-0.5 ${accent || "text-text-primary"}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function LeadSummaryCards({
  total,
  valid,
  invalid,
}: LeadSummaryCardsProps) {
  const validPercentage = total > 0 ? Math.round((valid / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar across full width */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-brand-500 to-brand-400"
            style={{ width: `${validPercentage}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-brand-600 tabular-nums shrink-0">
          {validPercentage}% valid
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem
          label="Total Uploaded"
          value={total}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-info-50"
          iconColor="text-info-600"
        />
        <StatItem
          label="Valid Leads"
          value={valid}
          icon={<UserCheck className="w-5 h-5" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          accent="text-success-600"
        />
        <StatItem
          label="Invalid Leads"
          value={invalid}
          icon={<UserX className="w-5 h-5" />}
          iconBg="bg-error-50"
          iconColor="text-error-600"
          accent={invalid > 0 ? "text-error-600" : "text-text-primary"}
        />
      </div>
    </div>
  );
}