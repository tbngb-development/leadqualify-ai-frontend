// src/app/admin/(protected)/campaigns/[id]/CampaignMonitorClient.tsx

"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Download,
  Megaphone,
  Building2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CampaignMetrics from "@/components/campaigns/CampaignMetrics";
import CampaignProgressBar from "@/components/campaigns/CampaignProgressBar";
import InterestDistribution from "@/components/campaigns/InterestDistribution";
import CampaignLeadsTable from "@/components/campaigns/CampaignLeadsTable";
import {
  mockCampaignDetail,
  mockCampaignLeads,
  type CampaignLeadDetail,
  type CampaignDetail,
} from "@/mocks/campaign-detail";
import type { CampaignStatus } from "@/types";
import { useRouter } from "next/navigation";

// ─── Status Config ────────────────────────

const campaignStatusConfig: Record<
  CampaignStatus,
  { label: string; variant: "success" | "warning" | "error" | "info" | "muted" }
> = {
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  completed: { label: "Completed", variant: "info" },
  draft: { label: "Draft", variant: "muted" },
  failed: { label: "Failed", variant: "error" },
};

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CampaignMonitorClient() {
  const [campaign, setCampaign] = useState<CampaignDetail>(mockCampaignDetail);
  const [leads] = useState<CampaignLeadDetail[]>(mockCampaignLeads);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const statusCfg = campaignStatusConfig[campaign.status];
  const isActive = campaign.status === "active";
  const isPaused = campaign.status === "paused";
  const isCompleted = campaign.status === "completed";

   const router = useRouter();

  // ─── Actions ─────────────────────────────

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  const handlePause = async () => {
    setIsPausing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCampaign((prev) => ({ ...prev, status: "paused" }));
    setIsPausing(false);
  };

  const handleResume = async () => {
    setIsResuming(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCampaign((prev) => ({ ...prev, status: "active" }));
    setIsResuming(false);
  };

  const handleRetryFailed = async () => {
    setIsRetrying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsRetrying(false);
    console.log("Retrying", campaign.calls_failed, "failed calls");
  };

  const handleExport = () => {
    console.log("Exporting campaign results");
  };

  const handleViewResult = (lead: CampaignLeadDetail) => {
    console.log("View result for:", lead.first_name, lead.last_name);
    // router.push(`/admin/results/${lead.id}`)
  };

  const handleBack = () => {
    console.log("Go back");
    router.push('/admin/campaigns')
  };

  // ─── Render ──────────────────────────────

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ─── Page Header ───────────────────── */}
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors duration-150 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Campaign info */}
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-50 text-brand-500 shrink-0 mt-0.5">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-text-primary">
                  {campaign.name}
                </h1>
                <Badge variant={statusCfg.variant} dot>
                  {statusCfg.label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Building2 className="w-3.5 h-3.5" />
                  {campaign.property_name}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  Started {formatDate(campaign.started_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              icon={
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              }
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              Refresh
            </Button>

            {isActive && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Pause className="w-3.5 h-3.5" />}
                onClick={handlePause}
                loading={isPausing}
              >
                Pause
              </Button>
            )}

            {isPaused && (
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="w-3.5 h-3.5" />}
                onClick={handleResume}
                loading={isResuming}
              >
                Resume
              </Button>
            )}

            {campaign.calls_failed > 0 && !isCompleted && (
              <Button
                variant="secondary"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleRetryFailed}
                loading={isRetrying}
              >
                Retry Failed ({campaign.calls_failed})
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Live Indicator ────────────────── */}
      {isActive && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-success-50 border border-success-100 rounded-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-500" />
          </span>
          <span className="text-sm font-medium text-success-600">
            Campaign is actively calling leads
          </span>
          <span className="text-xs text-text-muted ml-auto">
            Last updated: {timeAgo(campaign.updated_at)}
          </span>
        </div>
      )}

      {/* ─── Metrics ──────────────────────── */}
      <CampaignMetrics campaign={campaign} />

      {/* ─── Progress + Interest ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CampaignProgressBar campaign={campaign} />
          </Card>
        </div>
        <div>
          <InterestDistribution
            summary={campaign.results_summary}
            totalCompleted={campaign.calls_completed}
          />
        </div>
      </div>

      {/* ─── Campaign Details Strip ────────── */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CampaignDetailItem
            label="Started"
            value={formatDate(campaign.started_at)}
          />
          <CampaignDetailItem
            label="Est. Completion"
            value={formatDate(campaign.estimated_completion)}
          />
          <CampaignDetailItem
            label="Total Initiated"
            value={campaign.calls_initiated.toLocaleString()}
          />
          <CampaignDetailItem
            label="Success Rate"
            value={
              campaign.calls_initiated > 0
                ? `${Math.round(
                    (campaign.calls_completed / campaign.calls_initiated) * 100
                  )}%`
                : "—"
            }
          />
        </div>
      </Card>

      {/* ─── Leads Table ──────────────────── */}
      <Card padding="none">
        <div className="px-5 pt-5">
          <CardHeader
            title="Campaign Leads"
            subtitle={`${leads.length} leads in this campaign`}
          />
        </div>
        <div className="px-5 pb-5">
          <CampaignLeadsTable
            leads={leads}
            pageSize={10}
            onViewResult={handleViewResult}
          />
        </div>
      </Card>
    </div>
  );
}

// ─── Helper Component ──────────────────────

function CampaignDetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
    </div>
  );
}