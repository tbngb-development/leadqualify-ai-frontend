// src/components/leads/LeadListCard.tsx

"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Trash2,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { LeadList, LeadListStatus } from "@/types";

interface LeadListCardProps {
  leadList: LeadList;
  isSelected: boolean;
  onSelect: (leadList: LeadList) => void;
  onDelete?: (leadList: LeadList) => void;
}

type BadgeVariant = "success" | "warning" | "error" | "info" | "muted" | "default";

const statusConfig: Record<
  LeadListStatus,
  { label: string; variant: BadgeVariant; icon: React.ReactNode }
> = {
  ready: {
    label: "Ready",
    variant: "success",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  processing: {
    label: "Processing",
    variant: "warning",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  failed: {
    label: "Failed",
    variant: "error",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(name: string): string {
  return name;
}

export default function LeadListCard({
  leadList,
  isSelected,
  onSelect,
  onDelete,
}: LeadListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = statusConfig[leadList.status];
  const validPct =
    leadList.total_count > 0
      ? Math.round((leadList.valid_count / leadList.total_count) * 100)
      : 0;

  return (
    <button
      onClick={() => onSelect(leadList)}
      className={`
        w-full text-left
        p-4 rounded-xl border
        transition-all duration-200
        cursor-pointer
        group
        ${
          isSelected
            ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20"
            : "border-surface-border bg-surface hover:border-brand-300 hover:shadow-sm"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`
              flex items-center justify-center
              w-9 h-9 rounded-lg shrink-0 mt-0.5
              ${isSelected ? "bg-brand-100 text-brand-600" : "bg-surface-subtle text-text-muted"}
            `}
          >
            <FileSpreadsheet className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {leadList.name}
            </p>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {leadList.file_name}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative shrink-0">
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }
            }}
            className="flex items-center justify-center w-6 h-6 rounded-md text-text-placeholder hover:bg-surface-hover hover:text-text-muted opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </div>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-surface-border rounded-xl shadow-lg py-1 z-30 animate-[scaleIn_150ms_ease-out] origin-top-right">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(leadList);
                    setMenuOpen(false);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onSelect(leadList); setMenuOpen(false); } }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </div>
                <div className="my-1 border-t border-surface-border" />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(leadList);
                    setMenuOpen(false);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onDelete?.(leadList); setMenuOpen(false); } }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-error-500 hover:bg-error-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <Badge variant={status.variant}>
          <span className="flex items-center gap-1">
            {status.icon}
            {status.label}
          </span>
        </Badge>

        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Users className="w-3 h-3" />
          {leadList.total_count.toLocaleString()}
        </span>

        <span className="flex items-center gap-1 text-xs text-success-600">
          <UserCheck className="w-3 h-3" />
          {leadList.valid_count.toLocaleString()}
        </span>

        {leadList.invalid_count > 0 && (
          <span className="flex items-center gap-1 text-xs text-error-500">
            <UserX className="w-3 h-3" />
            {leadList.invalid_count}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {leadList.total_count > 0 && (
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex-1 h-1 bg-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-400 rounded-full transition-all duration-500"
              style={{ width: `${validPct}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-text-placeholder tabular-nums">
            {validPct}%
          </span>
        </div>
      )}

      {/* Date */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <Calendar className="w-3 h-3 text-text-placeholder" />
        <span className="text-[10px] text-text-placeholder">
          {formatDate(leadList.created_at)}
        </span>
      </div>
    </button>
  );
}