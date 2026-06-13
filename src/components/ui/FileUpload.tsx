// src/components/ui/FileUpload.tsx

"use client";

import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  hint?: string;
  error?: string;
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  status?: UploadStatus;
  uploadProgress?: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function FileUpload({
  label,
  accept = ".pdf",
  maxSizeMB = 10,
  hint,
  error,
  onFileSelect,
  onFileRemove,
  status = "idle",
  uploadProgress = 0,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setValidationError(null);

      // Check file type
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const matchesType = acceptedTypes.some(
        (type) =>
          type === fileExt ||
          type === file.type ||
          (type.endsWith("/*") && file.type.startsWith(type.replace("/*", "")))
      );

      if (!matchesType) {
        setValidationError(`Invalid file type. Accepted: ${accept}`);
        return false;
      }

      // Check file size
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setValidationError(`File too large. Maximum size: ${maxSizeMB}MB`);
        return false;
      }

      return true;
    },
    [accept, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileRemove?.();
  };

  const displayError = error || validationError;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      {/* File selected state */}
      {selectedFile && !displayError ? (
        <div
          className={`
            flex items-center gap-3
            px-4 py-3
            border rounded-lg
            transition-colors duration-150
            ${status === "success"
              ? "border-success-500 bg-success-50"
              : status === "error"
              ? "border-error-500 bg-error-50"
              : "border-surface-border bg-surface-muted"
            }
          `}
        >
          {/* Icon */}
          <div
            className={`
              flex items-center justify-center
              w-10 h-10 rounded-lg shrink-0
              ${status === "success"
                ? "bg-success-100 text-success-600"
                : status === "error"
                ? "bg-error-100 text-error-600"
                : "bg-brand-50 text-brand-500"
              }
            `}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : status === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-text-muted">
              {formatFileSize(selectedFile.size)}
              {status === "success" && " · Uploaded"}
              {status === "uploading" && ` · ${uploadProgress}%`}
            </p>

            {/* Progress bar */}
            {status === "uploading" && (
              <div className="mt-2 h-1 bg-surface-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Remove button */}
          {status !== "uploading" && (
            <button
              onClick={handleRemove}
              className="
                flex items-center justify-center
                w-8 h-8 rounded-md shrink-0
                text-text-muted
                hover:bg-surface-hover hover:text-text-primary
                transition-colors duration-150
                cursor-pointer
              "
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center
            gap-3
            px-6 py-8
            border-2 border-dashed rounded-xl
            cursor-pointer
            transition-all duration-200
            ${dragOver
              ? "border-brand-400 bg-brand-50"
              : displayError
              ? "border-error-500 bg-error-50"
              : "border-surface-border bg-surface-muted hover:border-brand-300 hover:bg-brand-50/50"
            }
          `}
        >
          <div
            className={`
              flex items-center justify-center
              w-12 h-12 rounded-xl
              ${dragOver
                ? "bg-brand-100 text-brand-500"
                : "bg-surface text-text-muted"
              }
              transition-colors duration-200
            `}
          >
            <Upload className="w-5 h-5" />
          </div>

          <div className="text-center">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-brand-500">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-text-muted mt-1">
              {accept.toUpperCase().replace(/\./g, "")} up to {maxSizeMB}MB
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {/* Error */}
      {displayError && (
        <p className="text-xs text-error-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-error-500" />
          {displayError}
        </p>
      )}

      {/* Hint */}
      {hint && !displayError && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}