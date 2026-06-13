// src/app/admin/(protected)/campaigns/create/CreateCampaignClient.tsx

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, Megaphone } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import PropertyInfoCard from "@/components/campaigns/PropertyInfoCard";
import CreateCampaignSteps from "@/components/campaigns/CreateCampaignSteps";
import { simulateUploadAndExtract } from "@/mocks/campaign-create";
import { campaignDraft } from "@/lib/campaign-draft";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";
import type { Property } from "@/types";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FormErrors {
  campaignName?: string;
  file?: string;
}

export default function CreateCampaignClient() {
  const router = useRouter();

  // ─── State ───────────────────────────────
  const [campaignName, setCampaignName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedProperty, setExtractedProperty] = useState<Property | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Validation ──────────────────────────
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!campaignName.trim()) {
      newErrors.campaignName = "Campaign name is required";
    } else if (campaignName.trim().length < 3) {
      newErrors.campaignName = "Campaign name must be at least 3 characters";
    }
    if (!extractedProperty) {
      newErrors.file = "Please upload a property document";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── File Upload ─────────────────────────
  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setErrors((prev) => ({ ...prev, file: undefined }));
    setUploadStatus("uploading");
    setUploadProgress(0);
    setExtractedProperty(null);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const property = await simulateUploadAndExtract(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");
      setExtractedProperty(property);

      // Auto-fill campaign name if empty
      if (!campaignName.trim()) {
        setCampaignName(`${property.name} Campaign`);
      }
    } catch {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setErrors((prev) => ({
        ...prev,
        file: "Failed to process document. Please try again.",
      }));
    }
  }, [campaignName]);

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setExtractedProperty(null);
  }, []);

  // ─── Save Draft ──────────────────────────
  const handleSaveDraft = async () => {
    if (!validateForm() || !extractedProperty) return;

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    // Save to draft store
    campaignDraft.save({
      campaign_name: campaignName.trim(),
      property_id: extractedProperty.id,
      property_name: extractedProperty.name,
      property_location: extractedProperty.location || "",
      property_price_range: extractedProperty.price_range || "",
      property_type: extractedProperty.property_type || "",
      property_developer: extractedProperty.developer || "",
      property_bedrooms: extractedProperty.bedrooms || "",
      property_completion_date: extractedProperty.completion_date || "",
      property_amenities: extractedProperty.amenities || [],
      property_description: extractedProperty.description || "",
      pdf_file_name: selectedFile?.name || extractedProperty.file_name,
    });

    setIsSaving(false);
    console.log("Saved as draft");
  };

  // ─── Continue to Step 2 ──────────────────
  const handleContinue = () => {
    if (!validateForm() || !extractedProperty) return;

    // Save step 1 data to draft store
    campaignDraft.save({
      campaign_name: campaignName.trim(),
      property_id: extractedProperty.id,
      property_name: extractedProperty.name,
      property_location: extractedProperty.location || "",
      property_price_range: extractedProperty.price_range || "",
      property_type: extractedProperty.property_type || "",
      property_developer: extractedProperty.developer || "",
      property_bedrooms: extractedProperty.bedrooms || "",
      property_completion_date: extractedProperty.completion_date || "",
      property_amenities: extractedProperty.amenities || [],
      property_description: extractedProperty.description || "",
      pdf_file_name: selectedFile?.name || extractedProperty.file_name,
    });

    // Navigate to step 2
    router.push(ADMIN_ROUTES.CAMPAIGNS_CREATE_LEADS);
  };

  const handleBack = () => {
    router.push(ADMIN_ROUTES.CAMPAIGNS);
  };

  // ─── Render ──────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Create Campaign
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              Configure your AI calling campaign in 3 simple steps
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <CreateCampaignSteps currentStep={1} />

      {/* Campaign Name */}
      <Card>
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Campaign Details
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Give your campaign a descriptive name
            </p>
          </div>
          <Input
            label="Campaign Name"
            placeholder="e.g. Marina Tower Q3 Outreach"
            value={campaignName}
            onChange={(e) => {
              setCampaignName(e.target.value);
              if (errors.campaignName) {
                setErrors((prev) => ({ ...prev, campaignName: undefined }));
              }
            }}
            error={errors.campaignName}
            hint="This name will help you identify the campaign later"
          />
        </div>
      </Card>

      {/* Property Upload */}
      <Card>
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Property Document
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Upload a property brochure, fact sheet, or price list.
              AI will extract key details automatically.
            </p>
          </div>
          <FileUpload
            label="Property Brochure (PDF)"
            accept=".pdf"
            maxSizeMB={10}
            hint="Supported: PDF up to 10MB. Fact sheets work best for AI extraction."
            error={errors.file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            status={uploadStatus}
            uploadProgress={Math.round(uploadProgress)}
          />
        </div>
      </Card>

      {/* Extracting Skeleton */}
      {uploadStatus === "uploading" && (
        <Card>
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-subtle" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-surface-subtle rounded w-48" />
                <div className="h-3 bg-surface-subtle rounded w-72" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-subtle rounded w-full" />
              <div className="h-3 bg-surface-subtle rounded w-5/6" />
              <div className="h-3 bg-surface-subtle rounded w-4/6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-surface-subtle" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2.5 bg-surface-subtle rounded w-16" />
                    <div className="h-3.5 bg-surface-subtle rounded w-28" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted text-center pt-2">
              Extracting property information from your document...
            </p>
          </div>
        </Card>
      )}

      {/* Extracted Property Card */}
      {extractedProperty && uploadStatus === "success" && (
        <PropertyInfoCard property={extractedProperty} />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <Button variant="ghost" onClick={handleBack}>
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSaveDraft}
            loading={isSaving}
            disabled={!campaignName.trim() || !extractedProperty}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={handleContinue}
            disabled={!campaignName.trim() || !extractedProperty}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}