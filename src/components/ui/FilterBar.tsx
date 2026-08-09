// src/components/ui/FilterBar.tsx

"use client";

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import type { ReactNode } from "react";

// ─── Single filter select ─────────────────────────────────────────────────────

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 rounded-md border border-surface-border bg-surface",
          "px-2.5 text-xs text-text-primary",
          "focus:outline-none focus:ring-1 focus:ring-brand-500",
          "transition-colors cursor-pointer"
        )}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Sort control ─────────────────────────────────────────────────────────────

interface SortSelectProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  options: { label: string; value: string }[];
}

export function SortSelect({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  options,
}: SortSelectProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-muted">Sort by</label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className={cn(
            "h-8 rounded-md border border-surface-border bg-surface",
            "px-2.5 text-xs text-text-primary",
            "focus:outline-none focus:ring-1 focus:ring-brand-500",
            "transition-colors cursor-pointer"
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
        className={cn(
          "h-8 rounded-md border border-surface-border bg-surface",
          "px-2.5 text-xs text-text-primary",
          "focus:outline-none focus:ring-1 focus:ring-brand-500",
          "transition-colors cursor-pointer"
        )}
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  );
}

// ─── Reset button ─────────────────────────────────────────────────────────────

interface FilterBarProps {
  children: ReactNode;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterBar({ children, hasActiveFilters, onReset }: FilterBarProps) {
  return (
    <div className="flex items-end gap-3 flex-wrap">
      {children}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-md",
            "text-xs font-medium text-error-600",
            "border border-error-100 bg-error-50",
            "hover:bg-error-100 transition-colors"
          )}
        >
          <X size={12} />
          Reset filters
        </button>
      )}
    </div>
  );
}