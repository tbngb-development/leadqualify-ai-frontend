// src/components/dashboard/StatCard.tsx

import { type ReactNode } from "react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  iconColor = "text-brand-500",
  iconBg = "bg-brand-50",
}: StatCardProps) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-text-primary tracking-tight">
            {formattedValue}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-medium ${
                  trend.direction === "up"
                    ? "text-success-600"
                    : trend.direction === "down"
                    ? "text-error-600"
                    : "text-text-muted"
                }`}
              >
                {trend.direction === "up" && "↑"}
                {trend.direction === "down" && "↓"}
                {trend.value}%
              </span>
              <span className="text-xs text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-lg
            ${iconBg} ${iconColor}
          `}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}