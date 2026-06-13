// src/app/admin/(protected)/results/CallResultsClient.tsx

"use client";

import { useState, useMemo } from "react";
import {
  PhoneCall,
  Flame,
  Sun,
  Snowflake,
  Download,
  BarChart3,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ResultsTable from "@/components/results/ResultsTable";
import TranscriptDrawer from "@/components/results/TranscriptDrawer";
import { mockCallResults, type CallResultDetail } from "@/mocks/call-results";

export default function CallResultsClient() {
  const results = mockCallResults;
  const [selectedResult, setSelectedResult] = useState<CallResultDetail | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ─── Summary Stats ──────────────────────
  const stats = useMemo(() => {
    const s = { total: results.length, hot: 0, warm: 0, cold: 0, not_interested: 0 };
    results.forEach((r) => {
      s[r.interest_level]++;
    });
    return s;
  }, [results]);

  const avgScore = useMemo(() => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.qualification_score, 0);
    return Math.round(total / results.length);
  }, [results]);

  const avgDuration = useMemo(() => {
    if (results.length === 0) return "0s";
    const total = results.reduce((sum, r) => sum + r.call_duration, 0);
    const avg = Math.round(total / results.length);
    const m = Math.floor(avg / 60);
    const s = avg % 60;
    return `${m}m ${s}s`;
  }, [results]);

  // ─── Handlers ───────────────────────────
  const handleViewTranscript = (result: CallResultDetail) => {
    setSelectedResult(result);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedResult(null), 300);
  };

  const handleExport = () => {
    console.log("Export results as CSV");
  };

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Call Results
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Review AI call transcripts and lead qualification
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <SummaryCard
            label="Total Results"
            value={stats.total}
            icon={<BarChart3 className="w-4 h-4" />}
            iconBg="bg-brand-50"
            iconColor="text-brand-500"
          />
          <SummaryCard
            label="Hot Leads"
            value={stats.hot}
            icon={<Flame className="w-4 h-4" />}
            iconBg="bg-error-50"
            iconColor="text-error-500"
            accent="text-error-600"
          />
          <SummaryCard
            label="Warm Leads"
            value={stats.warm}
            icon={<Sun className="w-4 h-4" />}
            iconBg="bg-warning-50"
            iconColor="text-warning-500"
            accent="text-warning-600"
          />
          <SummaryCard
            label="Cold Leads"
            value={stats.cold}
            icon={<Snowflake className="w-4 h-4" />}
            iconBg="bg-info-50"
            iconColor="text-info-500"
            accent="text-info-600"
          />
          <SummaryCard
            label="Avg Score"
            value={avgScore}
            suffix="/100"
            icon={<BarChart3 className="w-4 h-4" />}
            iconBg="bg-success-50"
            iconColor="text-success-500"
          />
          <SummaryCard
            label="Avg Duration"
            value={avgDuration}
            isString
            icon={<PhoneCall className="w-4 h-4" />}
            iconBg="bg-surface-subtle"
            iconColor="text-text-muted"
          />
        </div>

        {/* Results Table */}
        <Card padding="none">
          <div className="px-5 pt-5">
            <CardHeader
              title="All Call Results"
              subtitle={`${results.length} completed calls from Marina Heights Tower Launch`}
            />
          </div>
          <div className="px-5 pb-5">
            <ResultsTable
              results={results}
              pageSize={10}
              onViewTranscript={handleViewTranscript}
            />
          </div>
        </Card>
      </div>

      {/* Transcript Drawer */}
      <TranscriptDrawer
        result={selectedResult}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

// ─── Summary Card ──────────────────────────

function SummaryCard({
  label,
  value,
  suffix,
  isString = false,
  icon,
  iconBg,
  iconColor,
  accent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  isString?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent?: string;
}) {
  return (
    <Card hover>
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span
              className={`text-lg font-bold tabular-nums ${accent || "text-text-primary"}`}
            >
              {isString ? value : typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {suffix && (
              <span className="text-xs text-text-muted">{suffix}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}