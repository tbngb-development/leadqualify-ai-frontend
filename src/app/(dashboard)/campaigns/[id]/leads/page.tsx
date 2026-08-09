// src/app/(dashboard)/campaigns/[id]/leads/page.tsx

"use client";

import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadStatsCards } from "@/components/leads/LeadStatsCards";
import { FilterBar, FilterSelect, SortSelect } from "@/components/ui/FilterBar";
import { PageSpinner } from "@/components/ui/Spinner";
import { useLeads, useLeadStats } from "@/hooks/useLeads";
import { usePagination } from "@/hooks/usePagination";
import type { LeadStatus } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS: { label: string; value: LeadStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Calling", value: "CALLING" },
  { label: "Called", value: "CALLED" },
  { label: "No Answer", value: "NO_ANSWER" },
  { label: "Failed", value: "FAILED" },
];

const SORT_OPTIONS = [
  { label: "Date Added", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Last Updated", value: "updatedAt" },
];

const DNC_OPTIONS = [
  { label: "Do Not Call", value: "true" },
  { label: "Callable", value: "false" },
];

export default function CampaignLeadsPage() {
  const params = useParams();
  const campaignId = String(params.id);
  const { page, setPage } = usePagination();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [status, setStatus] = useState("");
  const [doNotCall, setDoNotCall] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const hasActiveFilters = !!(status || doNotCall);

  const resetFilters = () => {
    setStatus("");
    setDoNotCall("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading } = useLeads({
    campaignId,
    page,
    limit: 20,
    ...(status && { status: status as LeadStatus }),
    ...(doNotCall !== "" && { doNotCall: doNotCall === "true" }),
    sortBy,
    sortOrder,
  });

  const { data: stats, isLoading: statsLoading } = useLeadStats({ campaignId });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <Link
          href={`/campaigns/${campaignId}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-3 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Campaign
        </Link>
        <h2 className="text-lg font-semibold text-text-primary">
          Campaign Leads
        </h2>
      </div>

      {/* Stats cards */}
      {statsLoading ? (
        <PageSpinner />
      ) : stats ? (
        <LeadStatsCards stats={stats} />
      ) : null}

      {/* Filter bar */}
      <FilterBar hasActiveFilters={hasActiveFilters} onReset={resetFilters}>
        <FilterSelect
          label="Status"
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          label="Do Not Call"
          value={doNotCall}
          onChange={(v) => { setDoNotCall(v); setPage(1); }}
          options={DNC_OPTIONS}
        />
        <SortSelect
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={(v) => { setSortBy(v); setPage(1); }}
          onSortOrderChange={(v) => { setSortOrder(v); setPage(1); }}
          options={SORT_OPTIONS}
        />
      </FilterBar>

      {/* Table */}
      {isLoading ? (
        <PageSpinner />
      ) : (
        <LeadsTable
          leads={data?.leads ?? []}
          pagination={data?.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}