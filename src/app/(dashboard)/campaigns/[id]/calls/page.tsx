// src/app/(dashboard)/campaigns/[id]/calls/page.tsx

"use client";

import { CallsTable } from "@/components/calls/CallsTable";
import { CallStatsCards } from "@/components/calls/CallStatsCards";
import { FilterBar, FilterSelect, SortSelect } from "@/components/ui/FilterBar";
import { PageSpinner } from "@/components/ui/Spinner";
import { useCalls, useCallStats } from "@/hooks/useCalls";
import { usePagination } from "@/hooks/usePagination";
import type { CallStatus, Disposition, LeadTemperature } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// ─── Filter options ───────────────────────────────────────────────────────────

const STATUS_OPTIONS: { label: string; value: CallStatus }[] = [
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "No Answer", value: "NO_ANSWER" },
  { label: "Busy", value: "BUSY" },
  { label: "Calling", value: "CALLING" },
];

const DISPOSITION_OPTIONS: { label: string; value: Disposition }[] = [
  { label: "Consultant Follow-up", value: "QUALIFIED_CONSULTANT_FOLLOWUP" },
  { label: "Site Visit Interest", value: "SITE_VISIT_INTEREST" },
  { label: "Send Details", value: "INTERESTED_SEND_DETAILS" },
  { label: "General Interest", value: "INTERESTED_GENERAL" },
  { label: "Follow-up Requested", value: "FOLLOWUP_REQUESTED" },
  { label: "Not Interested", value: "NOT_INTERESTED" },
  { label: "Do Not Call", value: "DO_NOT_CALL" },
  { label: "Wrong Number", value: "WRONG_NUMBER" },
  { label: "Already Purchased", value: "ALREADY_PURCHASED" },
  { label: "Broker", value: "BROKER" },
  { label: "Language Callback", value: "LANGUAGE_CALLBACK_REQUIRED" },
  { label: "Ended by Customer", value: "CALL_ENDED_BY_CUSTOMER" },
  { label: "Abusive", value: "CALL_ENDED_ABUSIVE" },
  { label: "No Response", value: "NO_RESPONSE" },
  { label: "Call Dropped", value: "CALL_DROPPED" },
];

const TEMPERATURE_OPTIONS: { label: string; value: LeadTemperature }[] = [
  { label: "Hot", value: "HOT" },
  { label: "Warm", value: "WARM" },
  { label: "Nurture", value: "NURTURE" },
  { label: "Cold", value: "COLD" },
];

const SORT_OPTIONS = [
  { label: "Date", value: "createdAt" },
  { label: "Start Time", value: "startedAt" },
  { label: "Duration", value: "duration" },
];

export default function CampaignCallsPage() {
  const params = useParams();
  const campaignId = String(params.id);
  const { page, setPage } = usePagination();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [status, setStatus] = useState("");
  const [disposition, setDisposition] = useState("");
  const [leadTemperature, setLeadTemperature] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const hasActiveFilters = !!(status || disposition || leadTemperature);

  const resetFilters = () => {
    setStatus("");
    setDisposition("");
    setLeadTemperature("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading } = useCalls({
    campaignId,
    page,
    limit: 20,
    ...(status && { status: status as CallStatus }),
    ...(disposition && { disposition: disposition as Disposition }),
    ...(leadTemperature && {
      leadTemperature: leadTemperature as LeadTemperature,
    }),
    sortBy,
    sortOrder,
  });

  const { data: stats, isLoading: statsLoading } = useCallStats({ campaignId });

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
          Campaign Calls
        </h2>
      </div>

      {/* Stats cards */}
      {statsLoading ? (
        <PageSpinner />
      ) : stats ? (
        <CallStatsCards stats={stats} />
      ) : null}

      {/* Filter bar */}
      <FilterBar hasActiveFilters={hasActiveFilters} onReset={resetFilters}>
        <FilterSelect
          label="Status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          label="Disposition"
          value={disposition}
          onChange={(v) => {
            setDisposition(v);
            setPage(1);
          }}
          options={DISPOSITION_OPTIONS}
        />
        <FilterSelect
          label="Temperature"
          value={leadTemperature}
          onChange={(v) => {
            setLeadTemperature(v);
            setPage(1);
          }}
          options={TEMPERATURE_OPTIONS}
        />
        <SortSelect
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
          onSortOrderChange={(v) => {
            setSortOrder(v);
            setPage(1);
          }}
          options={SORT_OPTIONS}
        />
      </FilterBar>

      {/* Table */}
      {isLoading ? (
        <PageSpinner />
      ) : (
        <CallsTable
          calls={data?.calls ?? []}
          pagination={data?.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
