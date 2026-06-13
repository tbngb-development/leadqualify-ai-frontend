// src/components/leads/CSVUploadZone.tsx

"use client";

import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileSpreadsheet, X, CheckCircle, Table2 } from "lucide-react";

interface CSVUploadZoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  isUploading: boolean;
  isUploaded: boolean;
  uploadProgress: number;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function CSVUploadZone({
  onFileSelect,
  onFileRemove,
  isUploading,
  isUploaded,
  uploadProgress,
  fileName,
  fileSize,
  error,
}: CSVUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };

  // ─── Uploaded State ─────────────────────
  if (isUploaded && fileName) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 bg-success-50 border border-success-500/30 rounded-xl">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-100 text-success-600 shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {fileName}
          </p>
          <p className="text-xs text-success-600 mt-0.5">
            {fileSize ? formatFileSize(fileSize) : ""} · Uploaded & processed
          </p>
        </div>
        <button
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
            onFileRemove?.();
          }}
          className="
            flex items-center justify-center
            w-8 h-8 rounded-md shrink-0
            text-text-muted
            hover:bg-success-100 hover:text-text-primary
            transition-colors duration-150
            cursor-pointer
          "
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ─── Uploading State ────────────────────
  if (isUploading) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 bg-surface-muted border border-surface-border rounded-xl">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-500 shrink-0">
          <FileSpreadsheet className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {fileName || "Processing..."}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Validating leads · {Math.round(uploadProgress)}%
          </p>
          <div className="mt-2 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── Drop Zone ──────────────────────────
  return (
    <div className="space-y-1.5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center
          gap-4
          px-6 py-10
          border-2 border-dashed rounded-xl
          cursor-pointer
          transition-all duration-200
          ${
            dragOver
              ? "border-brand-400 bg-brand-50"
              : error
              ? "border-error-500 bg-error-50"
              : "border-surface-border bg-surface-muted hover:border-brand-300 hover:bg-brand-50/40"
          }
        `}
      >
        <div
          className={`
            flex items-center justify-center
            w-14 h-14 rounded-2xl
            transition-colors duration-200
            ${dragOver ? "bg-brand-100 text-brand-500" : "bg-surface text-text-muted shadow-xs"}
          `}
        >
          <Upload className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-brand-500">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-text-muted mt-1.5">
            CSV file up to 50MB
          </p>
        </div>

        {/* Expected format hint */}
        <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-surface-border">
          <Table2 className="w-3.5 h-3.5 text-text-placeholder" />
          <p className="text-xs text-text-muted">
            Required columns:{" "}
            <span className="font-medium text-text-secondary">first_name</span>,{" "}
            <span className="font-medium text-text-secondary">phone</span>
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-error-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-error-500" />
          {error}
        </p>
      )}
    </div>
  );
}