// src/app/admin/(protected)/leads/LeadsManagementClient.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Users,
  Upload,
  Search,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Download,
  Plus,
  ArrowLeft,
  X,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusFilter from "@/components/ui/StatusFilter";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import CSVUploadZone from "@/components/leads/CSVUploadZone";
import LeadSummaryCards from "@/components/leads/LeadSummaryCards";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadListCard from "@/components/leads/LeadListCard";
import {
  mockLeadLists,
  mockLeads,
  mockLeadListStats,
  simulateCSVUpload,
  type LeadListStats,
} from "@/mocks/leads";
import type { Lead, LeadList } from "@/types";

// ─── Filter Options ───────────────────────

const statusFilterOptions = [
  { value: "all", label: "All Status" },
  { value: "ready", label: "Ready", dot: "bg-success-500" },
  { value: "processing", label: "Processing", dot: "bg-warning-500" },
  { value: "failed", label: "Failed", dot: "bg-error-500" },
];

// ─── Page Component ───────────────────────

type PageView = "list" | "detail" | "upload";

export default function LeadsManagementClient() {
  // ─── State ─────────────────────────────
  const [leadLists] = useState<LeadList[]>(mockLeadLists);
  const [allLeads] = useState<Lead[]>(mockLeads);
  const [stats] = useState<LeadListStats>(mockLeadListStats);

  const [pageView, setPageView] = useState<PageView>("list");
  const [selectedList, setSelectedList] = useState<LeadList | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedList, setUploadedList] = useState<LeadList | null>(null);
  const [uploadedLeads, setUploadedLeads] = useState<Lead[]>([]);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<LeadList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Filtering ─────────────────────────
  const filteredLists = useMemo(() => {
    let result = leadLists;

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.file_name.toLowerCase().includes(q)
      );
    }

    return [...result].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [leadLists, statusFilter, searchQuery]);

  // Leads for selected list
  const selectedLeads = useMemo(() => {
    if (!selectedList) return [];
    return allLeads.filter((l) => l.lead_list_id === selectedList.id);
  }, [selectedList, allLeads]);

  // ─── Handlers ──────────────────────────
  const handleSelectList = useCallback((list: LeadList) => {
    setSelectedList(list);
    setPageView("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedList(null);
    setPageView("list");
  }, []);

  const handleUploadView = useCallback(() => {
    setPageView("upload");
    setUploadFile(null);
    setIsUploaded(false);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedList(null);
    setUploadedLeads([]);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadFile(file);
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setIsUploaded(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const result = await simulateCSVUpload(file);
      clearInterval(interval);
      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setUploadedList(result.leadList);
      setUploadedLeads(result.leads);
      setIsUploading(false);
      setIsUploaded(true);
    } catch {
      clearInterval(interval);
      setIsUploading(false);
      setUploadError("Failed to process CSV. Please check the format.");
    }
  }, []);

  const handleFileRemove = useCallback(() => {
    setUploadFile(null);
    setIsUploading(false);
    setIsUploaded(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedList(null);
    setUploadedLeads([]);
  }, []);

  const handleDeleteClick = useCallback((list: LeadList) => {
    setDeleteTarget(list);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsDeleting(false);
    setDeleteTarget(null);
    console.log("Deleted lead list:", deleteTarget.id);
  };

  const handleDownloadTemplate = () => {
    const headers = "first_name,last_name,phone,email,nationality,budget,notes";
    const sample =
      'Ahmed,Al Rashid,+971501234567,ahmed@email.com,UAE,"AED 2,000,000",Interested in 2BR';
    const csv = `${headers}\n${sample}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Upload View ───────────────────────
  if (pageView === "upload") {
    return (
      <>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div>
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lead Lists
            </button>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-primary">
                    Upload Leads
                  </h1>
                  <p className="text-sm text-text-muted mt-0.5">
                    Upload a CSV file with your lead data
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Button>
            </div>
          </div>

          {/* Upload Zone */}
          <Card>
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Lead Data
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Required columns:{" "}
                  <code className="px-1.5 py-0.5 bg-surface-subtle rounded text-xs font-mono text-text-secondary">
                    first_name
                  </code>{" "}
                  and{" "}
                  <code className="px-1.5 py-0.5 bg-surface-subtle rounded text-xs font-mono text-text-secondary">
                    phone
                  </code>
                </p>
              </div>
              <CSVUploadZone
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                isUploading={isUploading}
                isUploaded={isUploaded}
                uploadProgress={uploadProgress}
                fileName={uploadFile?.name}
                fileSize={uploadFile?.size}
                error={uploadError || undefined}
              />
            </div>
          </Card>

          {/* Skeleton */}
          {isUploading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <div className="flex items-center gap-4 animate-pulse">
                      <div className="w-11 h-11 rounded-xl bg-surface-subtle" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-surface-subtle rounded w-20" />
                        <div className="h-6 bg-surface-subtle rounded w-12" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {isUploaded && uploadedList && (
            <>
              <LeadSummaryCards
                total={uploadedList.total_count}
                valid={uploadedList.valid_count}
                invalid={uploadedList.invalid_count}
              />

              <Card padding="none">
                <div className="px-5 pt-5">
                  <CardHeader
                    title="Lead Preview"
                    subtitle={`${uploadedLeads.length} leads from ${uploadedList.file_name}`}
                  />
                </div>
                <div className="px-5 pb-5">
                  <LeadsTable leads={uploadedLeads} pageSize={8} />
                </div>
              </Card>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <Button variant="ghost" onClick={handleBackToList}>
              Cancel
            </Button>
            <Button
              disabled={!isUploaded}
              onClick={() => {
                console.log("Lead list saved");
                handleBackToList();
              }}
            >
              Save Lead List
            </Button>
          </div>
        </div>

        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Lead List"
          description={`Are you sure you want to delete "${deleteTarget?.name}"? All leads in this list will be removed. This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          loading={isDeleting}
        />
      </>
    );
  }

  // ─── Detail View ───────────────────────
  if (pageView === "detail" && selectedList) {
    return (
      <>
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Header */}
          <div>
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lead Lists
            </button>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-primary">
                    {selectedList.name}
                  </h1>
                  <p className="text-sm text-text-muted mt-0.5">
                    {selectedList.file_name} ·{" "}
                    {new Date(selectedList.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteClick(selectedList)}
              >
                Delete List
              </Button>
            </div>
          </div>

          {/* Summary */}
          <LeadSummaryCards
            total={selectedList.total_count}
            valid={selectedList.valid_count}
            invalid={selectedList.invalid_count}
          />

          {/* Leads Table */}
          <Card padding="none">
            <div className="px-5 pt-5">
              <CardHeader
                title="Leads"
                subtitle={`${selectedLeads.length} leads in this list`}
              />
            </div>
            <div className="px-5 pb-5">
              {selectedLeads.length > 0 ? (
                <LeadsTable leads={selectedLeads} pageSize={10} />
              ) : (
                <EmptyState
                  icon={<Users className="w-7 h-7" />}
                  title="No leads to display"
                  description="This lead list is still being processed or contains no leads."
                />
              )}
            </div>
          </Card>
        </div>

        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Lead List"
          description={`Are you sure you want to delete "${deleteTarget?.name}"? All leads in this list will be removed. This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          loading={isDeleting}
        />
      </>
    );
  }

  // ─── List View (Default) ───────────────
  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* ─── Header ──────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Leads</h1>
              <p className="text-sm text-text-muted mt-0.5">
                Manage all your lead lists and uploaded contacts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownloadTemplate}
            >
              Template
            </Button>
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={handleUploadView}
            >
              Upload Leads
            </Button>
          </div>
        </div>

        {/* ─── Stats ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatMiniCard
            label="Lead Lists"
            value={stats.total_lists}
            icon={<FileSpreadsheet className="w-4.5 h-4.5" />}
            iconBg="bg-brand-50"
            iconColor="text-brand-500"
          />
          <StatMiniCard
            label="Total Leads"
            value={stats.total_leads}
            icon={<Users className="w-4.5 h-4.5" />}
            iconBg="bg-info-50"
            iconColor="text-info-600"
          />
          <StatMiniCard
            label="Valid Leads"
            value={stats.total_valid}
            icon={<UserCheck className="w-4.5 h-4.5" />}
            iconBg="bg-success-50"
            iconColor="text-success-600"
            accent="text-success-600"
          />
          <StatMiniCard
            label="Invalid Leads"
            value={stats.total_invalid}
            icon={<UserX className="w-4.5 h-4.5" />}
            iconBg="bg-error-50"
            iconColor="text-error-600"
            accent={stats.total_invalid > 0 ? "text-error-600" : undefined}
          />
        </div>

        {/* ─── Toolbar ─────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-placeholder" />
              <input
                type="text"
                placeholder="Search lead lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <StatusFilter
              options={statusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
            />
          </div>

          <p className="text-xs text-text-muted">
            <span className="font-medium text-text-secondary">
              {filteredLists.length}
            </span>{" "}
            lead {filteredLists.length === 1 ? "list" : "lists"}
          </p>
        </div>

        {/* ─── Lead Lists Grid ─────────────── */}
        {filteredLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLists.map((list) => (
              <LeadListCard
                key={list.id}
                leadList={list}
                isSelected={selectedList?.id === list.id}
                onSelect={handleSelectList}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={<Users className="w-7 h-7" />}
              title={
                searchQuery || statusFilter !== "all"
                  ? "No lead lists match your filters"
                  : "No lead lists yet"
              }
              description={
                searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter."
                  : "Upload your first CSV to start managing leads for AI calling campaigns."
              }
              actionLabel={
                searchQuery || statusFilter !== "all"
                  ? undefined
                  : "Upload Leads"
              }
              onAction={
                searchQuery || statusFilter !== "all"
                  ? undefined
                  : handleUploadView
              }
            />
          </Card>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead List"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? All ${deleteTarget?.total_count.toLocaleString()} leads will be removed. This action cannot be undone.`}
        confirmLabel="Delete Lead List"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}

// ─── Stat Card ─────────────────────────────

function StatMiniCard({
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
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            {label}
          </p>
          <p
            className={`text-lg font-bold tabular-nums mt-0.5 ${accent || "text-text-primary"}`}
          >
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}