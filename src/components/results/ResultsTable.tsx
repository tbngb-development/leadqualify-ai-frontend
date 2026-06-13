// src/components/results/ResultsTable.tsx

"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Search,
  Clock,
  Flame,
  Sun,
  Snowflake,
  ThumbsDown,
  FileText,
  Filter,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { InterestLevel } from "@/types";
import type { CallResultDetail } from "@/mocks/call-results";

type InterestFilter = "all" | InterestLevel;
type BadgeVariant = "success" | "warning" | "error" | "info" | "muted" | "default";

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

function formatDuration(seconds: number): string {
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

function ScorePill({ score }: { score: number }) {
  let color = "text-text-muted bg-surface-subtle";
  if (score >= 80) color = "text-success-600 bg-success-50";
  else if (score >= 50) color = "text-warning-600 bg-warning-50";
  else if (score >= 20) color = "text-info-600 bg-info-50";

  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-6 rounded-md text-xs font-bold tabular-nums ${color}`}
    >
      {score}
    </span>
  );
}

// ─── Main ─────────────────────────────────

interface ResultsTableProps {
  results: CallResultDetail[];
  pageSize?: number;
  onViewTranscript: (result: CallResultDetail) => void;
}

export default function ResultsTable({
  results,
  pageSize = 10,
  onViewTranscript,
}: ResultsTableProps) {
  const [interestFilter, setInterestFilter] = useState<InterestFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Filtering ─────────────────────────
  const filteredResults = useMemo(() => {
    let list = results;

    if (interestFilter !== "all") {
      list = list.filter((r) => r.interest_level === interestFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.first_name.toLowerCase().includes(q) ||
          r.last_name.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.summary.toLowerCase().includes(q)
      );
    }

    return list;
  }, [results, interestFilter, searchQuery]);

  // ─── Pagination ────────────────────────
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const paginated = filteredResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ─── Counts ────────────────────────────
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: results.length };
    results.forEach((r) => {
      c[r.interest_level] = (c[r.interest_level] || 0) + 1;
    });
    return c;
  }, [results]);

  const filterTabs: { key: InterestFilter; label: string; icon?: React.ReactNode }[] = [
    { key: "all", label: "All" },
    { key: "hot", label: "Hot", icon: <Flame className="w-3 h-3" /> },
    { key: "warm", label: "Warm", icon: <Sun className="w-3 h-3" /> },
    { key: "cold", label: "Cold", icon: <Snowflake className="w-3 h-3" /> },
    {
      key: "not_interested",
      label: "Not Interested",
      icon: <ThumbsDown className="w-3 h-3" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-subtle rounded-lg overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setInterestFilter(tab.key);
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
                  interestFilter === tab.key
                    ? "bg-surface text-text-primary shadow-xs"
                    : "text-text-muted hover:text-text-secondary"
                }
              `}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`tabular-nums ${
                  interestFilter === tab.key
                    ? "text-text-secondary"
                    : "text-text-placeholder"
                }`}
              >
                {counts[tab.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search results..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full pl-9 pr-3 py-2
              text-sm text-text-primary
              bg-surface border border-surface-border rounded-lg
              placeholder:text-text-placeholder
              focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
              transition-all duration-150
            "
          />
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
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Interest
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">
                  Summary
                </th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {paginated.map((result) => {
                const fullName = `${result.first_name} ${result.last_name}`;
                const initials = getInitials(
                  result.first_name,
                  result.last_name
                );
                const avatarColor = getAvatarColor(fullName);
                const interest = interestConfig[result.interest_level];

                return (
                  <tr
                    key={result.id}
                    className="group hover:bg-surface-muted transition-colors duration-100"
                  >
                    {/* Lead */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold ${avatarColor}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {fullName}
                          </p>
                          <p className="text-xs text-text-muted">
                            {result.nationality}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-text-placeholder shrink-0" />
                        <span className="text-sm text-text-secondary tabular-nums">
                          {formatPhone(result.phone)}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-text-placeholder shrink-0" />
                        <span className="text-sm text-text-secondary tabular-nums">
                          {formatDuration(result.call_duration)}
                        </span>
                      </div>
                    </td>

                    {/* Interest */}
                    <td className="px-4 py-3.5">
                      <Badge variant={interest.variant}>
                        <span className="flex items-center gap-1">
                          {interest.icon}
                          {interest.label}
                        </span>
                      </Badge>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <ScorePill score={result.qualification_score} />
                    </td>

                    {/* Summary */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-text-muted line-clamp-2 max-w-xs leading-snug">
                        {result.summary}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FileText className="w-3.5 h-3.5" />}
                        onClick={() => onViewTranscript(result)}
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        Transcript
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty */}
        {paginated.length === 0 && (
          <div className="py-12 text-center">
            <Filter className="w-8 h-8 text-text-placeholder mx-auto mb-2" />
            <p className="text-sm text-text-muted">No results match your filter</p>
            <button
              onClick={() => {
                setInterestFilter("all");
                setSearchQuery("");
                setCurrentPage(1);
              }}
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
                {Math.min(currentPage * pageSize, filteredResults.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-text-secondary">
                {filteredResults.length}
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
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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