// src/components/campaigns/CampaignLeadsTable.tsx

"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Search,
  ChevronDown,
  Clock,
  Flame,
  Sun,
  Snowflake,
  ThumbsDown,
  PhoneCall,
  Loader2,
  PhoneOff,
  Filter,
  Eye,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { CampaignLeadStatus, InterestLevel } from "@/types";
import type { CampaignLeadDetail } from "@/mocks/campaign-detail";

// ─── Config Maps ──────────────────────────

type BadgeVariant = "success" | "warning" | "error" | "info" | "muted" | "default";

const callStatusConfig: Record<
  CampaignLeadStatus,
  { label: string; variant: BadgeVariant; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    variant: "muted",
    icon: <Clock className="w-3 h-3" />,
  },
  calling: {
    label: "Calling",
    variant: "info",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  completed: {
    label: "Completed",
    variant: "success",
    icon: <PhoneCall className="w-3 h-3" />,
  },
  failed: {
    label: "Failed",
    variant: "error",
    icon: <PhoneOff className="w-3 h-3" />,
  },
  skipped: {
    label: "Skipped",
    variant: "muted",
    icon: <PhoneOff className="w-3 h-3" />,
  },
};

const interestConfig: Record<
  InterestLevel,
  { label: string; variant: BadgeVariant; icon: React.ReactNode }
> = {
  hot: {
    label: "Hot",
    variant: "error",
    icon: <Flame className="w-3 h-3" />,
  },
  warm: {
    label: "Warm",
    variant: "warning",
    icon: <Sun className="w-3 h-3" />,
  },
  cold: {
    label: "Cold",
    variant: "info",
    icon: <Snowflake className="w-3 h-3" />,
  },
  not_interested: {
    label: "Not Interested",
    variant: "muted",
    icon: <ThumbsDown className="w-3 h-3" />,
  },
};

const failReasonLabels: Record<string, string> = {
  no_answer: "No Answer",
  busy: "Line Busy",
  voicemail: "Voicemail",
  failed: "Call Failed",
};

// ─── Filter Types ─────────────────────────

type StatusFilter = "all" | CampaignLeadStatus;
type InterestFilter = "all" | InterestLevel;

// ─── Helpers ──────────────────────────────

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatPhone(phone: string): string {
  if (phone.startsWith("+971") && phone.length >= 12) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  }
  return phone;
}

function getInitials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-brand-100 text-brand-600",
    "bg-info-100 text-info-600",
    "bg-warning-100 text-warning-600",
    "bg-success-100 text-success-600",
    "bg-error-100 text-error-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ─── Score Indicator ──────────────────────

function QualificationScore({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-text-placeholder">—</span>;

  let color = "text-text-muted";
  let bg = "bg-surface-subtle";
  if (score >= 80) {
    color = "text-success-600";
    bg = "bg-success-50";
  } else if (score >= 50) {
    color = "text-warning-600";
    bg = "bg-warning-50";
  } else if (score >= 20) {
    color = "text-info-600";
    bg = "bg-info-50";
  } else {
    color = "text-text-muted";
    bg = "bg-surface-subtle";
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        w-9 h-6 rounded-md
        text-xs font-bold tabular-nums
        ${color} ${bg}
      `}
    >
      {score}
    </span>
  );
}

// ─── Main Component ───────────────────────

interface CampaignLeadsTableProps {
  leads: CampaignLeadDetail[];
  pageSize?: number;
  onViewResult?: (lead: CampaignLeadDetail) => void;
}

export default function CampaignLeadsTable({
  leads,
  pageSize = 10,
  onViewResult,
}: CampaignLeadsTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [interestFilter, setInterestFilter] = useState<InterestFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // ─── Filtering ─────────────────────────
  const filteredLeads = useMemo(() => {
    let result = leads;

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (interestFilter !== "all") {
      result = result.filter((l) => l.interest_level === interestFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.first_name.toLowerCase().includes(q) ||
          l.last_name.toLowerCase().includes(q) ||
          l.phone.includes(q)
      );
    }

    return result;
  }, [leads, statusFilter, interestFilter, searchQuery]);

  // ─── Pagination ────────────────────────
  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setInterestFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // ─── Counts ────────────────────────────
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Status tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Status tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-subtle rounded-lg overflow-x-auto no-scrollbar">
            {(
              [
                { key: "all", label: "All" },
                { key: "completed", label: "Completed" },
                { key: "calling", label: "Calling" },
                { key: "pending", label: "Pending" },
                { key: "failed", label: "Failed" },
              ] as { key: StatusFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`
                  flex items-center gap-1.5
                  px-3 py-1.5
                  text-xs font-medium
                  rounded-md
                  whitespace-nowrap
                  transition-all duration-150
                  cursor-pointer
                  ${
                    statusFilter === tab.key
                      ? "bg-surface text-text-primary shadow-xs"
                      : "text-text-muted hover:text-text-secondary"
                  }
                `}
              >
                {tab.label}
                {statusCounts[tab.key] !== undefined && (
                  <span
                    className={`tabular-nums ${
                      statusFilter === tab.key
                        ? "text-text-secondary"
                        : "text-text-placeholder"
                    }`}
                  >
                    {statusCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-placeholder" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="
                w-full
                pl-9 pr-3 py-2
                text-sm text-text-primary
                bg-surface
                border border-surface-border
                rounded-lg
                placeholder:text-text-placeholder
                focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                transition-all duration-150
              "
            />
          </div>
        </div>

        {/* Row 2: Interest filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-text-muted font-medium">Interest:</span>
          {(
            [
              { key: "all", label: "All" },
              { key: "hot", label: "🔥 Hot" },
              { key: "warm", label: "☀️ Warm" },
              { key: "cold", label: "❄️ Cold" },
              { key: "not_interested", label: "Not Interested" },
            ] as { key: InterestFilter; label: string }[]
          ).map((pill) => (
            <button
              key={pill.key}
              onClick={() => {
                setInterestFilter(pill.key);
                setCurrentPage(1);
              }}
              className={`
                px-2.5 py-1
                text-xs font-medium
                rounded-full
                border
                transition-all duration-150
                cursor-pointer
                ${
                  interestFilter === pill.key
                    ? "bg-brand-50 text-brand-600 border-brand-200"
                    : "bg-surface text-text-muted border-surface-border hover:border-brand-200 hover:text-text-secondary"
                }
              `}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-surface-border rounded-xl overflow-hidden bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-muted border-b border-surface-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Call Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Interest
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
                  Score
                </th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {paginatedLeads.map((lead) => {
                const fullName = `${lead.first_name} ${lead.last_name}`;
                const isExpanded = expandedRow === lead.id;
                const statusCfg = callStatusConfig[lead.status];
                const interestCfg = lead.interest_level
                  ? interestConfig[lead.interest_level]
                  : null;

                return (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    fullName={fullName}
                    statusCfg={statusCfg}
                    interestCfg={interestCfg}
                    isExpanded={isExpanded}
                    onToggle={() =>
                      setExpandedRow(isExpanded ? null : lead.id)
                    }
                    onViewResult={onViewResult}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty */}
        {paginatedLeads.length === 0 && (
          <div className="py-12 text-center">
            <Filter className="w-8 h-8 text-text-placeholder mx-auto mb-2" />
            <p className="text-sm text-text-muted">No leads match your filters</p>
            <button
              onClick={resetFilters}
              className="text-xs text-brand-500 font-medium mt-2 hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border bg-surface-muted">
            <p className="text-xs text-text-muted">
              <span className="font-medium text-text-secondary">
                {(currentPage - 1) * pageSize + 1}
              </span>
              –
              <span className="font-medium text-text-secondary">
                {Math.min(currentPage * pageSize, filteredLeads.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-text-secondary">
                {filteredLeads.length}
              </span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium text-text-muted rounded-md hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-brand-500 text-white"
                        : "text-text-muted hover:bg-surface-hover"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium text-text-muted rounded-md hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Table Row ─────────────────────────────

interface LeadRowProps {
  lead: CampaignLeadDetail;
  fullName: string;
  statusCfg: (typeof callStatusConfig)[CampaignLeadStatus];
  interestCfg: (typeof interestConfig)[InterestLevel] | null;
  isExpanded: boolean;
  onToggle: () => void;
  onViewResult?: (lead: CampaignLeadDetail) => void;
}

function LeadRow({
  lead,
  fullName,
  statusCfg,
  interestCfg,
  isExpanded,
  onToggle,
  onViewResult,
}: LeadRowProps) {
  const avatarColor = getAvatarColor(fullName);
  const initials = getInitials(lead.first_name, lead.last_name);
  const isCalling = lead.status === "calling";

  return (
    <>
      <tr
        className={`
          group transition-colors duration-100
          ${isCalling ? "bg-info-50/40" : "hover:bg-surface-muted"}
        `}
      >
        {/* Lead */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full shrink-0
                text-xs font-bold
                ${isCalling ? "ring-2 ring-info-300 ring-offset-1" : ""}
                ${avatarColor}
              `}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {fullName}
              </p>
              {lead.email && (
                <p className="text-xs text-text-muted truncate max-w-[160px]">
                  {lead.email}
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Phone */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-text-placeholder shrink-0" />
            <span className="text-sm text-text-secondary tabular-nums">
              {formatPhone(lead.phone)}
            </span>
          </div>
        </td>

        {/* Call Status */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <Badge variant={statusCfg.variant} dot={!isCalling}>
              <span className="flex items-center gap-1">
                {isCalling && statusCfg.icon}
                {statusCfg.label}
              </span>
            </Badge>
            {lead.call_status &&
              lead.status === "failed" &&
              lead.call_status !== "failed" && (
                <span className="text-xs text-text-placeholder">
                  ({failReasonLabels[lead.call_status] || lead.call_status})
                </span>
              )}
          </div>
        </td>

        {/* Duration */}
        <td className="px-4 py-3.5">
          {isCalling ? (
            <span className="inline-flex items-center gap-1 text-sm text-info-600">
              <span className="w-1.5 h-1.5 rounded-full bg-info-500 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-sm text-text-secondary tabular-nums">
              {formatDuration(lead.call_duration)}
            </span>
          )}
        </td>

        {/* Interest */}
        <td className="px-4 py-3.5">
          {interestCfg ? (
            <Badge variant={interestCfg.variant}>
              <span className="flex items-center gap-1">
                {interestCfg.icon}
                {interestCfg.label}
              </span>
            </Badge>
          ) : (
            <span className="text-xs text-text-placeholder">—</span>
          )}
        </td>

        {/* Score */}
        <td className="px-4 py-3.5 hidden lg:table-cell">
          <QualificationScore score={lead.qualification_score} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1">
            {lead.status === "completed" && onViewResult && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => onViewResult(lead)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View
              </Button>
            )}
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-7 h-7 rounded-md text-text-placeholder hover:bg-surface-hover hover:text-text-muted transition-all duration-150 cursor-pointer"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded */}
      {isExpanded && (
        <tr className="bg-surface-muted">
          <td colSpan={7} className="px-4 py-4">
            <div className="pl-11 space-y-3">
              {lead.summary && (
                <div className="p-3 bg-surface rounded-lg border border-surface-border">
                  <p className="text-xs font-medium text-text-muted mb-1">
                    AI Call Summary
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {lead.summary}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {lead.call_initiated_at && (
                  <DetailItem
                    label="Call Started"
                    value={new Date(lead.call_initiated_at).toLocaleString()}
                  />
                )}
                {lead.call_ended_at && (
                  <DetailItem
                    label="Call Ended"
                    value={new Date(lead.call_ended_at).toLocaleString()}
                  />
                )}
                {lead.qualification_score !== null && (
                  <DetailItem
                    label="Qualification Score"
                    value={`${lead.qualification_score}/100`}
                  />
                )}
              </div>

              {lead.status === "failed" && (
                <div className="flex items-center gap-2 text-xs text-error-500">
                  <PhoneOff className="w-3.5 h-3.5" />
                  Reason:{" "}
                  {lead.call_status
                    ? failReasonLabels[lead.call_status] || lead.call_status
                    : "Unknown error"}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
    </div>
  );
}