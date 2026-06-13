// src/app/admin/(protected)/campaigns/create/review/ReviewCampaignClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Rocket,
  Building2,
  Users,
  MapPin,
  DollarSign,
  BedDouble,
  Calendar,
  FileSpreadsheet,
  UserCheck,
  UserX,
  CheckCircle,
  Megaphone,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CreateCampaignSteps from "@/components/campaigns/CreateCampaignSteps";
import { campaignDraft } from "@/lib/campaign-draft";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";

export default function ReviewCampaignClient() {
  const router = useRouter();
  const [draft] = useState(() => campaignDraft.get());
  const [isLaunching, setIsLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  // Guard: if missing required data redirect back
  useEffect(() => {
    if (!draft.campaign_name || !draft.property_id) {
      router.replace(ADMIN_ROUTES.CAMPAIGNS_CREATE);
      return;
    }
    if (!draft.lead_list_id) {
      router.replace(ADMIN_ROUTES.CAMPAIGNS_CREATE_LEADS);
    }
  }, [draft, router]);

  // ─── Launch ───────────────────────────────
  const handleLaunch = async () => {
    setIsLaunching(true);

    // Mock: simulate campaign creation + Vapi setup
    await new Promise((r) => setTimeout(r, 2000));

    // Mock campaign ID returned from API
    const mockCampaignId = "camp-" + Date.now();

    // Clear draft
    campaignDraft.clear();

    setIsLaunching(false);
    setLaunched(true);

    // Small delay to show success, then navigate
    await new Promise((r) => setTimeout(r, 1000));

    router.push(ADMIN_ROUTES.CAMPAIGN_DETAIL(mockCampaignId));
  };

  const handleBack = () => {
    router.push(ADMIN_ROUTES.CAMPAIGNS_CREATE_LEADS);
  };

  // ─── Launched Success State ───────────────
  if (launched) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success-500" />
            </div>
            <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🚀</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Campaign Launched!
          </h2>
          <p className="text-sm text-text-muted max-w-sm">
            Your AI calling campaign is starting. Redirecting to the monitor...
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload Leads
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Review & Launch
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              Review your campaign before launching AI calls
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <CreateCampaignSteps currentStep={3} />

      {/* Campaign Name */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500 shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Campaign Name</p>
            <p className="text-base font-bold text-text-primary mt-0.5">
              {draft.campaign_name}
            </p>
          </div>
          <Badge variant="muted" className="ml-auto">
            Draft
          </Badge>
        </div>
      </Card>

      {/* Property Summary */}
      <Card>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-text-muted" />
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Property
            </h3>
          </div>

          <div>
            <p className="text-base font-bold text-text-primary">
              {draft.property_name}
            </p>
            {draft.property_developer && (
              <p className="text-xs text-text-muted mt-0.5">
                by {draft.property_developer}
              </p>
            )}
          </div>

          {/* Property Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {draft.property_location && (
              <InfoRow
                icon={<MapPin className="w-3.5 h-3.5" />}
                label="Location"
                value={draft.property_location}
              />
            )}
            {draft.property_price_range && (
              <InfoRow
                icon={<DollarSign className="w-3.5 h-3.5" />}
                label="Price Range"
                value={draft.property_price_range}
              />
            )}
            {draft.property_bedrooms && (
              <InfoRow
                icon={<BedDouble className="w-3.5 h-3.5" />}
                label="Bedrooms"
                value={draft.property_bedrooms}
              />
            )}
            {draft.property_type && (
              <InfoRow
                icon={<Building2 className="w-3.5 h-3.5" />}
                label="Type"
                value={draft.property_type}
              />
            )}
            {draft.property_completion_date && (
              <InfoRow
                icon={<Calendar className="w-3.5 h-3.5" />}
                label="Completion"
                value={draft.property_completion_date}
              />
            )}
            {draft.pdf_file_name && (
              <InfoRow
                icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
                label="Document"
                value={draft.pdf_file_name}
              />
            )}
          </div>

          {/* Amenities */}
          {draft.property_amenities && draft.property_amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {draft.property_amenities.slice(0, 6).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-text-secondary bg-surface-muted border border-surface-border rounded-full"
                >
                  <Sparkles className="w-2.5 h-2.5 text-brand-400" />
                  {amenity}
                </span>
              ))}
              {draft.property_amenities.length > 6 && (
                <span className="text-xs text-text-muted self-center">
                  +{draft.property_amenities.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Leads Summary */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-text-muted" />
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Lead List
            </h3>
          </div>

          <div>
            <p className="text-base font-bold text-text-primary">
              {draft.lead_list_name}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {draft.lead_list_file_name}
            </p>
          </div>

          {/* Lead Counts */}
          <div className="grid grid-cols-3 gap-3">
            <LeadCountCard
              label="Total Leads"
              value={draft.total_leads || 0}
              icon={<Users className="w-4 h-4" />}
              color="text-info-600"
              bg="bg-info-50"
            />
            <LeadCountCard
              label="Will Be Called"
              value={draft.valid_leads || 0}
              icon={<UserCheck className="w-4 h-4" />}
              color="text-success-600"
              bg="bg-success-50"
            />
            <LeadCountCard
              label="Will Be Skipped"
              value={draft.invalid_leads || 0}
              icon={<UserX className="w-4 h-4" />}
              color="text-error-600"
              bg="bg-error-50"
            />
          </div>

          {/* Valid progress bar */}
          {(draft.total_leads || 0) > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round(((draft.valid_leads || 0) / (draft.total_leads || 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-brand-600 tabular-nums">
                {Math.round(((draft.valid_leads || 0) / (draft.total_leads || 1)) * 100)}% valid
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* AI Config Info */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-text-muted" />
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              AI Calling Configuration
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ConfigRow label="Max Call Duration" value="5 minutes" />
            <ConfigRow label="Calls per Minute" value="1 call" />
            <ConfigRow label="Retry Attempts" value="1 retry" />
            <ConfigRow label="AI Voice" value="Rachel (ElevenLabs)" />
            <ConfigRow label="AI Model" value="GPT-4o Mini" />
            <ConfigRow label="Language" value="English" />
          </div>

          <p className="text-xs text-text-muted">
            The AI agent will introduce the property, qualify leads, and collect
            callback requests automatically.
          </p>
        </div>
      </Card>

      {/* Launch Warning */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-brand-50 border border-brand-100 rounded-xl">
        <Rocket className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Ready to launch?
          </p>
          <p className="text-xs text-brand-600 mt-0.5">
            AI calls will start immediately for{" "}
            <strong>{(draft.valid_leads || 0).toLocaleString()} leads</strong>.
            You can pause the campaign at any time from the monitor page.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <Button variant="ghost" onClick={handleBack}>
          Back
        </Button>

        <Button
          variant="primary"
          icon={<Rocket className="w-4 h-4" />}
          iconPosition="right"
          onClick={handleLaunch}
          loading={isLaunching}
          className="px-6"
        >
          {isLaunching ? "Launching Campaign..." : "Launch Campaign"}
        </Button>
      </div>
    </div>
  );
}

// ─── Sub Components ───────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-text-placeholder mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted">{label}</p>
        <p className="text-xs font-medium text-text-primary mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function LeadCountCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className={`p-3 rounded-xl ${bg} flex flex-col items-center text-center gap-1.5`}>
      <span className={color}>{icon}</span>
      <p className={`text-xl font-bold tabular-nums ${color}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] font-medium text-text-muted">{label}</p>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className="text-xs font-medium text-text-primary">{value}</p>
    </div>
  );
}