// src/components/campaigns/CSVUploader.tsx

"use client";

import { Button } from "@/components/ui/Button";
import { useUploadCSV } from "@/hooks/useCampaigns";
import { cn } from "@/lib/utils/cn";
import type { UploadResult } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface CSVUploaderProps {
  campaignId: string;
}

export function CSVUploader({ campaignId }: CSVUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadCSV(campaignId);

  const validateAndSet = useCallback((file: File) => {
    setError(null);
    setLastResult(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only .csv files are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndSet(file);
    },
    [validateAndSet]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSet(file);
      e.target.value = "";
    },
    [validateAndSet]
  );

  const handleZoneClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: (result: UploadResult) => {
        setSelectedFile(null);
        setError(null);
        setLastResult(result);
      },
      onError: (err: Error) => {
        setError(err?.message ?? "Upload failed. Please try again.");
      },
    });
  }, [selectedFile, upload]);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload CSV file"
      />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop CSV file here or click to browse"
        onClick={handleZoneClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          "transition-colors cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-surface-border hover:border-brand-300 hover:bg-brand-50/50"
        )}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              dragging ? "bg-brand-200" : "bg-brand-100"
            )}
          >
            <Upload
              size={20}
              className={cn(
                "transition-colors",
                dragging ? "text-brand-700" : "text-brand-600"
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {dragging ? "Release to upload" : "Drop your CSV file here"}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              or{" "}
              <span className="text-brand-600 hover:underline">
                browse files
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-error-50 border border-error-100 p-3">
          <AlertCircle size={14} className="text-error-500 shrink-0" />
          <p className="text-xs text-error-600">{error}</p>
        </div>
      )}

      {/* Upload result report */}
      {lastResult && (
        <div className="rounded-md border border-surface-border bg-surface-subtle p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-success-500 shrink-0" />
            <p className="text-xs font-semibold text-text-primary">
              Upload Complete
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            <ResultStat label="Total rows" value={lastResult.total} />
            <ResultStat
              label="Imported"
              value={lastResult.imported}
              highlight="success"
            />
            <ResultStat
              label="Duplicates skipped"
              value={lastResult.duplicates}
              highlight={lastResult.duplicates > 0 ? "warning" : undefined}
            />
            <ResultStat
              label="Invalid rows"
              value={lastResult.invalid}
              highlight={lastResult.invalid > 0 ? "error" : undefined}
            />
          </div>

          {/* Duplicate phone list */}
          {lastResult.duplicateNumbers.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-text-muted mb-1">
                Duplicate numbers skipped:
              </p>
              <div className="max-h-24 overflow-y-auto flex flex-wrap gap-1">
                {lastResult.duplicateNumbers.map((phone) => (
                  <span
                    key={phone}
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono bg-warning-50 text-warning-700 border border-warning-100"
                  >
                    {phone}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSV format hint */}
      <div className="rounded-md bg-info-50 border border-info-100 p-3">
        <p className="text-xs font-medium text-info-600 mb-1.5">
          CSV Format Guide
        </p>
        <p className="text-xs text-text-muted font-mono">
          name, phone, email, company
        </p>
        <p className="text-xs text-text-muted mt-1">
          Required: <span className="font-medium">name</span>,{" "}
          <span className="font-medium">phone</span>. Optional: email, company
        </p>
      </div>

      {/* Selected file + upload button */}
      {selectedFile && (
        <div className="flex items-center justify-between rounded-md border border-surface-border bg-surface-subtle p-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-text-muted">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <Button
              size="sm"
              onClick={handleUpload}
              loading={isPending}
              disabled={isPending}
              leftIcon={<Upload size={13} />}
            >
              Upload
            </Button>
            <button
              onClick={handleRemove}
              disabled={isPending}
              aria-label="Remove selected file"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded",
                "text-text-muted hover:bg-surface-hover",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Result stat cell ──────────────────────────────────────────────────────────

function ResultStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "success" | "warning" | "error";
}) {
  const colorMap = {
    success: "text-success-600",
    warning: "text-warning-600",
    error: "text-error-600",
  };
  return (
    <div className="flex flex-col">
      <p className="text-xs text-text-muted">{label}</p>
      <p
        className={cn(
          "text-lg font-bold",
          highlight ? colorMap[highlight] : "text-text-primary"
        )}
      >
        {value}
      </p>
    </div>
  );
}