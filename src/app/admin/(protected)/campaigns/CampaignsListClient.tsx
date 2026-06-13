// src/app/admin/(protected)/campaigns/CampaignsListClient.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Phone,
  BarChart3,
  CheckCircle2,
  Zap,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusFilter from "@/components/ui/StatusFilter";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import {
  mockCampaigns,
  mockCampaignListStats,
  type CampaignListStats,
} from "@/mocks/campaigns";
import type { Campaign, CampaignStatus } from "@/types";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";

// ─── Config ───────────────────────────────

type BadgeVariant = "success" | "warning" | "error" | "info" | "muted" | "default";

const statusConfig: Record<
  CampaignStatus,
  { label: string; variant: BadgeVariant; dot: string }
> = {
  active: { label: "Running", variant: "success", dot: "bg-success-500" },
  paused: { label: "Paused", variant: "warning", dot: "bg-warning-500" },
  completed: { label: "Completed", variant: "info", dot: "bg-info-500" },
  draft: { label: "Draft", variant: "muted", dot: "bg-text-placeholder" },
  failed: { label: "Failed", variant: "error", dot: "bg-error-500" },
};

const filterOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Running", dot: "bg-success-500" },
  { value: "paused", label: "Paused", dot: "bg-warning-500" },
  { value: "completed", label: "Completed", dot: "bg-info-500" },
  { value: "draft", label: "Draft", dot: "bg-text-placeholder" },
  { value: "failed", label: "Failed", dot: "bg-error-500" },
];

// ─── Helpers ──────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getProgressPct(campaign: Campaign): number {
  if (campaign.total_leads === 0) return 0;
  return Math.round(
    ((campaign.calls_completed + campaign.calls_failed) /
      campaign.total_leads) *
      100
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}

function getPropertyColor(name: string): string {
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

// ─── Page Component ───────────────────────

const PAGE_SIZE = 8;

export default function CampaignsListClient() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [stats] = useState<CampaignListStats>(mockCampaignListStats);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Action menu
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // ─── Filtering ─────────────────────────
  const filteredCampaigns = useMemo(() => {
    let result = campaigns;

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.property_name?.toLowerCase().includes(q)
      );
    }

    // Sort: active first, then by date
    result = [...result].sort((a, b) => {
      const order: Record<CampaignStatus, number> = {
        active: 0,
        paused: 1,
        draft: 2,
        failed: 3,
        completed: 4,
      };
      const statusDiff = order[a.status] - order[b.status];
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [campaigns, statusFilter, searchQuery]);

  // ─── Pagination ────────────────────────
  const totalPages = Math.ceil(filteredCampaigns.length / PAGE_SIZE);
  const paginated = filteredCampaigns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ─── Handlers ──────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleCreate = () => {
    console.log("Navigate to create campaign");
    router.push(ADMIN_ROUTES.CAMPAIGNS_CREATE)

  };

  const handleView = (campaign: Campaign) => {
    console.log("View campaign:", campaign.id);
    router.push(ADMIN_ROUTES.CAMPAIGN_DETAIL(campaign.id))
    setActiveMenu(null);
  };

  const handleEdit = (campaign: Campaign) => {
    console.log("Edit campaign:", campaign.id);
    setActiveMenu(null);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setDeleteTarget(campaign);
    setActiveMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsDeleting(false);
    setDeleteTarget(null);
    console.log("Deleted campaign:", deleteTarget.id);
  };

  // Close menu on outside click
  const handleMenuToggle = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // ─── Render ────────────────────────────
  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* ─── Header ──────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Campaigns
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Manage and monitor your AI calling campaigns
              </p>
            </div>
          </div>

          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Create Campaign
          </Button>
        </div>

        {/* ─── Stats Cards ─────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Campaigns"
            value={stats.total_campaigns}
            icon={<Megaphone className="w-5 h-5" />}
            iconBg="bg-brand-50"
            iconColor="text-brand-500"
          />
          <StatCard
            label="Active Campaigns"
            value={stats.active_campaigns}
            icon={<Zap className="w-5 h-5" />}
            iconBg="bg-success-50"
            iconColor="text-success-600"
            accent="text-success-600"
          />
          <StatCard
            label="Completed"
            value={stats.completed_campaigns}
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconBg="bg-info-50"
            iconColor="text-info-600"
          />
          <StatCard
            label="Total Leads"
            value={stats.total_leads}
            icon={<Phone className="w-5 h-5" />}
            iconBg="bg-warning-50"
            iconColor="text-warning-600"
          />
        </div>

        {/* ─── Table Card ──────────────────── */}
        <Card padding="none">
          {/* Toolbar */}
          <div className="px-5 pt-5 pb-4 border-b border-surface-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardHeader
                title="All Campaigns"
                subtitle={`${filteredCampaigns.length} campaign${filteredCampaigns.length !== 1 ? "s" : ""}`}
                className="!mb-0"
              />

              <div className="flex items-center gap-2.5">
                {/* Search */}
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-placeholder" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
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

                {/* Status Filter */}
                <StatusFilter
                  options={filterOptions}
                  value={statusFilter}
                  onChange={handleStatusChange}
                  placeholder="All Status"
                />
              </div>
            </div>
          </div>

          {/* Table or Empty */}
          {paginated.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-muted border-b border-surface-border">
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">
                        Property
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
                        Progress
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">
                        Created
                      </th>
                      <th className="px-5 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {paginated.map((campaign) => {
                      const status = statusConfig[campaign.status];
                      const pct = getProgressPct(campaign);
                      const propName = campaign.property_name || "—";
                      const propColor = getPropertyColor(propName);
                      const propInitials = getInitials(propName);
                      const isMenuOpen = activeMenu === campaign.id;

                      return (
                        <tr
                          key={campaign.id}
                          className="group hover:bg-surface-muted transition-colors duration-100"
                        >
                          {/* Campaign Name */}
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleView(campaign)}
                              className="text-left cursor-pointer group/name"
                            >
                              <p className="text-sm font-medium text-text-primary group-hover/name:text-brand-600 transition-colors">
                                {campaign.name}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5 md:hidden">
                                {propName}
                              </p>
                            </button>
                          </td>

                          {/* Property */}
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-bold shrink-0 ${propColor}`}
                              >
                                {propInitials}
                              </div>
                              <span className="text-sm text-text-secondary truncate max-w-[140px]">
                                {propName}
                              </span>
                            </div>
                          </td>

                          {/* Leads */}
                          <td className="px-5 py-3.5">
                            <div>
                              <span className="text-sm font-medium text-text-primary tabular-nums">
                                {campaign.total_leads.toLocaleString()}
                              </span>
                              {campaign.calls_completed > 0 && (
                                <p className="text-xs text-text-muted mt-0.5 tabular-nums">
                                  {campaign.calls_completed.toLocaleString()}{" "}
                                  called
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Progress */}
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <div className="flex items-center gap-2.5 min-w-[120px]">
                              <div className="flex-1 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                                    campaign.status === "failed"
                                      ? "bg-error-400"
                                      : campaign.status === "completed"
                                      ? "bg-info-500"
                                      : "bg-brand-500"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-text-muted tabular-nums w-8 text-right">
                                {pct}%
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <Badge variant={status.variant} dot>
                              {status.label}
                            </Badge>
                          </td>

                          {/* Created */}
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span className="text-sm text-text-muted">
                              {formatDate(campaign.created_at)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5">
                            <div className="relative">
                              <button
                                onClick={() => handleMenuToggle(campaign.id)}
                                className="
                                  flex items-center justify-center
                                  w-8 h-8 rounded-lg
                                  text-text-placeholder
                                  hover:bg-surface-hover hover:text-text-muted
                                  opacity-0 group-hover:opacity-100
                                  transition-all duration-150
                                  cursor-pointer
                                "
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {isMenuOpen && (
                                <>
                                  {/* Invisible overlay to close */}
                                  <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setActiveMenu(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-surface-border rounded-xl shadow-lg py-1.5 z-30 animate-[scaleIn_150ms_ease-out] origin-top-right">
                                    <MenuItem
                                      icon={<Eye className="w-3.5 h-3.5" />}
                                      label="View"
                                      onClick={() => handleView(campaign)}
                                    />
                                    <MenuItem
                                      icon={
                                        <Pencil className="w-3.5 h-3.5" />
                                      }
                                      label="Edit"
                                      onClick={() => handleEdit(campaign)}
                                      disabled={campaign.status === "active"}
                                    />
                                    <div className="my-1.5 border-t border-surface-border" />
                                    <MenuItem
                                      icon={
                                        <Trash2 className="w-3.5 h-3.5" />
                                      }
                                      label="Delete"
                                      onClick={() =>
                                        handleDeleteClick(campaign)
                                      }
                                      danger
                                      disabled={campaign.status === "active"}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border bg-surface-muted">
                  <p className="text-xs text-text-muted">
                    Showing{" "}
                    <span className="font-medium text-text-secondary">
                      {(currentPage - 1) * PAGE_SIZE + 1}
                    </span>
                    –
                    <span className="font-medium text-text-secondary">
                      {Math.min(
                        currentPage * PAGE_SIZE,
                        filteredCampaigns.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-text-secondary">
                      {filteredCampaigns.length}
                    </span>
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-medium text-text-muted rounded-md hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, i) => {
                        let page: number;
                        if (totalPages <= 5) page = i + 1;
                        else if (currentPage <= 3) page = i + 1;
                        else if (currentPage >= totalPages - 2)
                          page = totalPages - 4 + i;
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
                      }
                    )}
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
            </>
          ) : (
            /* Empty State */
            <EmptyState
              icon={<Megaphone className="w-7 h-7" />}
              title={
                searchQuery || statusFilter !== "all"
                  ? "No campaigns match your filters"
                  : "No campaigns yet"
              }
              description={
                searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Create your first AI calling campaign to start qualifying leads automatically."
              }
              actionLabel={
                searchQuery || statusFilter !== "all"
                  ? undefined
                  : "Create Campaign"
              }
              onAction={
                searchQuery || statusFilter !== "all"
                  ? undefined
                  : handleCreate
              }
            />
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will remove all call results and data associated with this campaign. This action cannot be undone.`}
        confirmLabel="Delete Campaign"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}

// ─── Stat Card ─────────────────────────────

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent?: string;
}) {
  return (
    <Card hover>
      <div className="flex items-center gap-3.5">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
            {label}
          </p>
          <p
            className={`text-xl font-bold tabular-nums mt-0.5 ${accent || "text-text-primary"}`}
          >
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}

// ─── Menu Item ─────────────────────────────

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2.5 w-full
        px-3.5 py-2
        text-sm
        transition-colors duration-100
        cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          danger
            ? "text-error-500 hover:bg-error-50"
            : "text-text-secondary hover:bg-surface-hover"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}