// src/app/admin/(protected)/campaigns/create/leads/UploadLeadsClient.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Users,
  Download,
  Rocket,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CSVUploadZone from "@/components/leads/CSVUploadZone";
import LeadSummaryCards from "@/components/leads/LeadSummaryCards";
import LeadsTable from "@/components/leads/LeadsTable";
import CreateCampaignSteps from "@/components/campaigns/CreateCampaignSteps";
import { simulateCSVUpload } from "@/mocks/leads";
import { campaignDraft } from "@/lib/campaign-draft";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";
import type { Lead, LeadList } from "@/types";

export default function UploadLeadsClient() {
  const router = useRouter();

  // Read step 1 data from draft
  const [draft, setDraft] = useState(() => campaignDraft.get());

  // Guard: if no step 1 data, redirect back
  useEffect(() => {
    if (!draft.campaign_name || !draft.property_id) {
      router.replace(ADMIN_ROUTES.CAMPAIGNS_CREATE);
    }
  }, [draft, router]);

  // ─── State ───────────────────────────────
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [leadList, setLeadList] = useState<LeadList | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // ─── File Upload ─────────────────────────
  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setIsUploaded(false);
    setLeadList(null);
    setLeads([]);

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
      setLeadList(result.leadList);
      setLeads(result.leads);
      setIsUploading(false);
      setIsUploaded(true);
    } catch {
      clearInterval(interval);
      setIsUploading(false);
      setUploadError("Failed to process CSV. Please check the format and try again.");
    }
  }, []);

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
    setIsUploading(false);
    setIsUploaded(false);
    setUploadProgress(0);
    setUploadError(null);
    setLeadList(null);
    setLeads([]);
  }, []);

  const handleDownloadTemplate = () => {
    const headers = "first_name,last_name,phone,email,nationality,budget,notes";
    const sample = 'Ahmed,Al Rashid,+971501234567,ahmed@email.com,UAE,"AED 2,000,000",Interested in 2BR';
    const csv = `${headers}\n${sample}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Navigation ───────────────────────────
  const handleBack = () => {
    router.push(ADMIN_ROUTES.CAMPAIGNS_CREATE);
  };

  // Continue to Step 3
  const handleContinue = () => {
    if (!leadList || !isUploaded) return;

    // Save step 2 data
    campaignDraft.save({
      lead_list_id: leadList.id,
      lead_list_name: leadList.name,
      lead_list_file_name: leadList.file_name,
      total_leads: leadList.total_count,
      valid_leads: leadList.valid_count,
      invalid_leads: leadList.invalid_count,
    });

    router.push(ADMIN_ROUTES.CAMPAIGNS_CREATE_REVIEW);
  };

  // ─── Render ──────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaign Details
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Upload Leads
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Upload leads for{" "}
                <span className="font-medium text-text-secondary">
                  {draft.campaign_name}
                </span>
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

      {/* Step Indicator */}
      <CreateCampaignSteps currentStep={2} />

      {/* Upload Card */}
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
            fileName={selectedFile?.name}
            fileSize={selectedFile?.size}
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
      {isUploaded && leadList && (
        <>
          <LeadSummaryCards
            total={leadList.total_count}
            valid={leadList.valid_count}
            invalid={leadList.invalid_count}
          />

          {leadList.invalid_count > 0 && (
            <div className="flex items-start gap-3 px-4 py-3.5 bg-warning-50 border border-warning-100 rounded-xl">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning-100 text-warning-600 shrink-0">
                <span className="text-sm font-bold">{leadList.invalid_count}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-warning-600">
                  {leadList.invalid_count} leads have validation issues
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Invalid leads will be skipped during the campaign.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleFileRemove} className="shrink-0 ml-auto">
                Re-upload
              </Button>
            </div>
          )}

          <Card padding="none">
            <div className="px-5 pt-5">
              <CardHeader
                title="Lead Preview"
                subtitle={`Showing ${leads.length} leads from ${leadList.file_name}`}
              />
            </div>
            <div className="px-5 pb-5">
              <LeadsTable leads={leads} pageSize={8} />
            </div>
          </Card>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <Button variant="ghost" onClick={handleBack}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          {isUploaded && (
            <Button variant="secondary" icon={<Upload className="w-4 h-4" />} onClick={handleFileRemove}>
              Re-upload
            </Button>
          )}
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={handleContinue}
            disabled={!isUploaded || !leadList || leadList.valid_count === 0}
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  );
}