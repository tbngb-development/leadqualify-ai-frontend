// src/components/campaigns/CampaignVariablesStep.tsx

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { FloatingInput } from "@/components/ui/FloatingInput";
import {
  ChevronLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  FileText,
} from "lucide-react";
import { useExtractBrochure } from "@/hooks/useBrochure";
import type { PromptInputField, FlattenedBrochure } from "@/types";

// ─── Fields auto-injected from lead data — hidden entirely ────────────────────
const LEAD_AUTO_FIELDS = new Set([
  "customer_name",
  "customer_phone",
  "phone",
  "lead_source",
]);

// ─── Required fields — must be filled before submit ───────────────────────────
const REQUIRED_VARIABLES = new Set(["agent_name", "project_short_description"]);

// ─── Character limits per field ───────────────────────────────────────────────
const CHAR_LIMITS: Record<string, number> = {
  project_short_description: 100,
};

// ─── Brochure field mapping ───────────────────────────────────────────────────
const BROCHURE_TO_VARIABLE_MAP: Record<string, keyof FlattenedBrochure> = {
  project_name: "projectName",
  builder_name: "developerName",
  project_location: "fullAddress",
  verified_starting_price: "startingPrice",
  verified_rera_information: "reraNumber",
  verified_possession_information: "possessionDate",
  available_configurations: "configurations",
  verified_amenities: "amenities",
  verified_project_highlights: "usps",
};

interface CampaignVariablesStepProps {
  variables: PromptInputField[];
  isLoadingVariables: boolean;
  variablesError: boolean;
  isCreating: boolean;
  assistantName: string;
  onSubmit: (variables: Record<string, string>) => void;
  onBack: () => void;
}

export function CampaignVariablesStep({
  variables,
  isLoadingVariables,
  variablesError,
  isCreating,
  assistantName,
  onSubmit,
  onBack,
}: CampaignVariablesStepProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brochureLinked, setBrochureLinked] = useState(false);
  const [brochureName, setBrochureName] = useState<string | null>(null);
  const [autoFilledKeys, setAutoFilledKeys] = useState<Set<string>>(new Set());

  const { mutate: extractBrochure, isPending: extracting } =
    useExtractBrochure();

  // ── Visible variables — exclude auto-injected lead fields ─────────────────
  const visibleVariables = variables.filter(
    (v) => !LEAD_AUTO_FIELDS.has(v.key)
  );

  // ── Initialize values ─────────────────────────────────────────────────────
  useEffect(() => {
    if (visibleVariables.length > 0 && Object.keys(values).length === 0) {
      const initial: Record<string, string> = {};
      visibleVariables.forEach((v) => {
        initial[v.key] = "";
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(initial);
    }
  }, [variables]);

  const updateValue = (key: string, value: string) => {
    // Enforce char limit
    const limit = CHAR_LIMITS[key];
    if (limit && value.length > limit) return;

    setValues((prev) => ({ ...prev, [key]: value }));

    // Clear error on change
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }

    // Remove auto-fill indicator if manually edited
    setAutoFilledKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  // ── Validate required fields ──────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const key of REQUIRED_VARIABLES) {
      if (visibleVariables.some((v) => v.key === key)) {
        const val = values[key]?.trim() ?? "";
        if (!val) {
          newErrors[key] = `${key.replace(/_/g, " ")} is required`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Brochure upload ───────────────────────────────────────────────────────
  const handleBrochureUpload = (file: File) => {
    extractBrochure(
      { file, onProgress: () => {} },
      {
        onSuccess: (result) => {
          const brochure = result.flattenedForSave;
          const filled = new Set<string>();

          setValues((prev) => {
            const updated = { ...prev };
            for (const [varKey, brochureField] of Object.entries(
              BROCHURE_TO_VARIABLE_MAP
            )) {
              if (!(varKey in updated)) continue;
              if (updated[varKey]) continue;

              const rawValue = brochure[brochureField];
              let stringValue = "";

              if (Array.isArray(rawValue)) {
                stringValue = rawValue.join(", ");
              } else if (rawValue !== null && rawValue !== undefined) {
                stringValue = String(rawValue);
              }

              // Respect char limit when auto-filling
              const limit = CHAR_LIMITS[varKey];
              if (limit && stringValue.length > limit) {
                stringValue = stringValue.slice(0, limit);
              }

              if (stringValue) {
                updated[varKey] = stringValue;
                filled.add(varKey);
              }
            }
            return updated;
          });

          setAutoFilledKeys(filled);
          setBrochureLinked(true);
          setBrochureName(brochure.projectName ?? file.name);
        },
      }
    );
  };

  const handleRemoveBrochure = () => {
    setValues((prev) => {
      const updated = { ...prev };
      autoFilledKeys.forEach((key) => {
        updated[key] = "";
      });
      return updated;
    });
    setAutoFilledKeys(new Set());
    setBrochureLinked(false);
    setBrochureName(null);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const filled: Record<string, string> = {};
    for (const [key, value] of Object.entries(values)) {
      if (value.trim() !== "") {
        filled[key] = value.trim();
      }
    }
    onSubmit(filled);
  };

  const filledCount = Object.values(values).filter(
    (v) => v.trim() !== ""
  ).length;
  const totalCount = visibleVariables.length;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoadingVariables) {
    return (
      <Card>
        <div className="flex items-center justify-center gap-3 py-12">
          <Spinner size="sm" />
          <p className="text-sm text-text-muted">
            Loading agent configuration...
          </p>
        </div>
      </Card>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (variablesError) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-12">
          <AlertCircle size={24} className="text-error" />
          <p className="text-sm text-error">
            Failed to load agent variables. Please go back and try again.
          </p>
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </Card>
    );
  }

  // ── No variables ──────────────────────────────────────────────────────────
  if (visibleVariables.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Card>
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 size={24} className="text-success" />
            <p className="text-sm font-medium text-text-primary">
              No configuration needed
            </p>
            <p className="text-xs text-text-muted">
              This agent does not require any campaign variables.
            </p>
          </div>
        </Card>
        <div className="flex items-center gap-3">
          <Button onClick={() => onSubmit({})} loading={isCreating}>
            Create Campaign
          </Button>
          <Button
            variant="outline"
            leftIcon={<ChevronLeft size={14} />}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Fill in your prompt variables
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Configuring{" "}
            <span className="font-medium text-text-primary">
              {assistantName}
            </span>
            {" — "}
            {filledCount}/{totalCount} filled
          </p>
        </div>
      </div>

      {/* Brochure upload */}
      {brochureLinked ? (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-100 p-3">
          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">
              {brochureName}
            </p>
            <p className="text-xs text-green-600">
              {autoFilledKeys.size} field
              {autoFilledKeys.size !== 1 ? "s" : ""} auto-filled from brochure
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemoveBrochure}
            className="text-green-400 hover:text-error transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : extracting ? (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          <Spinner size="sm" />
          <p className="text-sm text-text-primary">
            Extracting property data...
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            document.getElementById("brochure-upload-input")?.click()
          }
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-surface-secondary/30 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <Upload size={14} />
          Upload brochure PDF to auto-fill matching fields
          <input
            id="brochure-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBrochureUpload(file);
              e.target.value = "";
            }}
          />
        </button>
      )}

      {/* Variable grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleVariables.map((variable) => {
          const isAutoFilled = autoFilledKeys.has(variable.key);
          const isRequired = REQUIRED_VARIABLES.has(variable.key);
          const charLimit = CHAR_LIMITS[variable.key];
          const value = values[variable.key] ?? "";
          const fieldError = errors[variable.key];

          return (
            <div key={variable.key} className="relative flex flex-col gap-1">
              <div className="relative">
                <FloatingInput
                  label={`${variable.key}${isRequired ? " *" : ""}`}
                  value={value}
                  onChange={(e) => updateValue(variable.key, e.target.value)}
                />
                {isAutoFilled && <AutoFilledDot />}
              </div>

              {/* Char limit counter */}
              {charLimit && (
                <p
                  className={`text-xs text-right ${
                    value.length >= charLimit
                      ? "text-error-500"
                      : "text-text-placeholder"
                  }`}
                >
                  {value.length}/{charLimit}
                </p>
              )}

              {/* Validation error */}
              {fieldError && (
                <p className="text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Required fields note */}
      <p className="text-xs text-text-muted flex items-center gap-1">
        <span className="text-error-500">*</span>
        Required fields must be filled before creating the campaign.
      </p>

      {/* Footer info */}
      <div className="flex items-start gap-2 text-xs text-text-muted">
        <FileText size={12} className="mt-0.5 shrink-0" />
        <p>
          Empty optional fields will be handled gracefully by the agent using
          its fallback responses.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSubmit} loading={isCreating}>
          Create Campaign
        </Button>
        <Button
          variant="outline"
          leftIcon={<ChevronLeft size={14} />}
          onClick={onBack}
          disabled={isCreating}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

function AutoFilledDot() {
  return (
    <div
      className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none"
      title="Auto-filled from brochure"
    >
      <Sparkles size={10} className="text-primary" />
    </div>
  );
}