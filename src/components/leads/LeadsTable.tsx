// src/components/leads/LeadsTable.tsx

"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Mail,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Lead } from "@/types";

type FilterTab = "all" | "valid" | "invalid";

interface LeadsTableProps {
  leads: Lead[];
  pageSize?: number;
}

function formatPhone(phone: string): string {
  if (!phone) return "—";
  // Basic formatting: +971 50 123 4567
  if (phone.startsWith("+971") && phone.length >= 12) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  }
  return phone;
}

function getInitials(firstName: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return `${first}${last}` || "?";
}

// Deterministic color from name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-brand-100 text-brand-600",
    "bg-info-100 text-info-600",
    "bg-secondary-50 text-secondary-600",
    "bg-warning-100 text-warning-600",
    "bg-success-100 text-success-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function LeadsTable({ leads, pageSize = 10 }: LeadsTableProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // ─── Filtering ─────────────────────────
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Tab filter
    if (activeTab === "valid") {
      result = result.filter((l) => l.is_valid);
    } else if (activeTab === "invalid") {
      result = result.filter((l) => !l.is_valid);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.first_name.toLowerCase().includes(q) ||
          l.last_name?.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, activeTab, searchQuery]);

  // ─── Pagination ────────────────────────
  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page on filter change
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // ─── Tab counts ────────────────────────
  const validCount = leads.filter((l) => l.is_valid).length;
  const invalidCount = leads.filter((l) => !l.is_valid).length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: leads.length },
    { key: "valid", label: "Valid", count: validCount },
    { key: "invalid", label: "Invalid", count: invalidCount },
  ];

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-subtle rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`
                flex items-center gap-1.5
                px-3 py-1.5
                text-xs font-medium
                rounded-md
                transition-all duration-150
                cursor-pointer
                ${
                  activeTab === tab.key
                    ? "bg-surface text-text-primary shadow-xs"
                    : "text-text-muted hover:text-text-secondary"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                  tabular-nums
                  ${
                    activeTab === tab.key
                      ? "text-text-secondary"
                      : "text-text-placeholder"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
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

      {/* Table */}
      <div className="border border-surface-border rounded-xl overflow-hidden bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-muted border-b border-surface-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-8">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
                  Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-24">
                  Status
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-border">
              {paginatedLeads.map((lead) => {
                const fullName = `${lead.first_name} ${lead.last_name || ""}`.trim();
                const isExpanded = expandedRow === lead.id;

                return (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    fullName={fullName}
                    isExpanded={isExpanded}
                    onToggle={() =>
                      setExpandedRow(isExpanded ? null : lead.id)
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {paginatedLeads.length === 0 && (
          <div className="py-12 text-center">
            <Filter className="w-8 h-8 text-text-placeholder mx-auto mb-2" />
            <p className="text-sm text-text-muted">No leads match your filter</p>
            <p className="text-xs text-text-placeholder mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border bg-surface-muted">
            <p className="text-xs text-text-muted">
              Showing{" "}
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
                className="
                  px-3 py-1.5
                  text-xs font-medium
                  text-text-muted
                  rounded-md
                  hover:bg-surface-hover
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors duration-150
                  cursor-pointer
                "
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-8 h-8
                      text-xs font-medium
                      rounded-md
                      transition-colors duration-150
                      cursor-pointer
                      ${
                        currentPage === page
                          ? "bg-brand-500 text-white"
                          : "text-text-muted hover:bg-surface-hover"
                      }
                    `}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="
                  px-3 py-1.5
                  text-xs font-medium
                  text-text-muted
                  rounded-md
                  hover:bg-surface-hover
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors duration-150
                  cursor-pointer
                "
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

// ─── Individual Lead Row ───────────────────

interface LeadRowProps {
  lead: Lead;
  fullName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function LeadRow({ lead, fullName, isExpanded, onToggle }: LeadRowProps) {
  const avatarColor = getAvatarColor(fullName);
  const initials = getInitials(lead.first_name, lead.last_name);

  return (
    <>
      <tr
        className={`
          group
          transition-colors duration-100
          ${!lead.is_valid ? "bg-error-50/30" : "hover:bg-surface-muted"}
        `}
      >
        {/* Row # */}
        <td className="px-4 py-3">
          <span className="text-xs text-text-placeholder tabular-nums">
            {lead.row_number}
          </span>
        </td>

        {/* Name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full shrink-0
                text-xs font-bold
                ${avatarColor}
              `}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {fullName || "—"}
              </p>
              {lead.nationality && (
                <p className="text-xs text-text-muted mt-0.5">
                  {lead.nationality}
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Phone */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-text-placeholder shrink-0" />
            <span
              className={`text-sm tabular-nums ${
                lead.is_valid ? "text-text-secondary" : "text-error-500 line-through"
              }`}
            >
              {formatPhone(lead.phone)}
            </span>
          </div>
        </td>

        {/* Email */}
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex items-center gap-2">
            {lead.email ? (
              <>
                <Mail className="w-3.5 h-3.5 text-text-placeholder shrink-0" />
                <span className="text-sm text-text-muted truncate max-w-[180px]">
                  {lead.email}
                </span>
              </>
            ) : (
              <span className="text-sm text-text-placeholder">—</span>
            )}
          </div>
        </td>

        {/* Budget */}
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-sm text-text-secondary">
            {lead.budget || "—"}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          {lead.is_valid ? (
            <Badge variant="success" dot>
              Valid
            </Badge>
          ) : (
            <Badge variant="error" dot>
              Invalid
            </Badge>
          )}
        </td>

        {/* Expand */}
        <td className="px-4 py-3">
          <button
            onClick={onToggle}
            className="
              flex items-center justify-center
              w-7 h-7 rounded-md
              text-text-placeholder
              hover:bg-surface-hover hover:text-text-muted
              transition-all duration-150
              cursor-pointer
            "
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </td>
      </tr>

      {/* Expanded Details */}
      {isExpanded && (
        <tr className="bg-surface-muted">
          <td colSpan={7} className="px-4 py-4">
            <div className="pl-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lead.email && (
                <DetailField label="Email" value={lead.email} />
              )}
              {lead.nationality && (
                <DetailField label="Nationality" value={lead.nationality} />
              )}
              {lead.budget && (
                <DetailField label="Budget" value={lead.budget} />
              )}
              {lead.notes && (
                <DetailField label="Notes" value={lead.notes} />
              )}
              {!lead.is_valid && lead.invalid_reason && (
                <div className="sm:col-span-3">
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-error-50 border border-error-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-error-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-error-600">
                        Validation Error
                      </p>
                      <p className="text-xs text-error-500 mt-0.5">
                        {lead.invalid_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
    </div>
  );
}