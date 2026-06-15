// src/components/campaigns/CSVUploader.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { useUploadCSV } from "@/hooks/useCampaigns";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, FileText, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface CSVUploaderProps {
  campaignId: string;
}

export function CSVUploader({ campaignId }: CSVUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadCSV(campaignId);

  // ✅ Stable validation extracted so both handlers share it
  const validateAndSet = useCallback((file: File) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only .csv files are accepted");
      return;
    }

    // Optional: guard against huge files (e.g. 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB");
      return;
    }

    setSelectedFile(file);
  }, []);

  // ✅ Drag handlers — stop ALL propagation on dragover
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
    [validateAndSet],
  );

  // ✅ Input change — read from ref to be safe
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSet(file);
      // Reset input value so same file can be re-selected
      e.target.value = "";
    },
    [validateAndSet],
  );

  // ✅ Separate click handler on the zone itself
  const handleZoneClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        setError(null);
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
      {/* ✅ Hidden input lives OUTSIDE the drop zone */}
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
          // ✅ Keyboard accessible
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
            : "border-surface-border hover:border-brand-300 hover:bg-brand-50/50",
        )}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              dragging ? "bg-brand-200" : "bg-brand-100",
            )}
          >
            <Upload
              size={20}
              className={cn(
                "transition-colors",
                dragging ? "text-brand-700" : "text-brand-600",
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

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-error-50 border border-error-100 p-3">
          <AlertCircle size={14} className="text-error-500 shrink-0" />
          <p className="text-xs text-error-600">{error}</p>
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
                "disabled:opacity-40 disabled:cursor-not-allowed",
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
