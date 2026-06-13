// src/components/properties/PropertyCard.tsx

"use client";

import {
  MapPin,
  DollarSign,
  BedDouble,
  Calendar,
  Building2,
  FileText,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import type { Property, DocumentType, ExtractionStatus } from "@/types";

interface PropertyCardProps {
  property: Property;
  onView?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

type BadgeVariant = "success" | "warning" | "error" | "info" | "muted" | "default";

const docTypeConfig: Record<DocumentType, { label: string; variant: BadgeVariant }> = {
  fact_sheet: { label: "Fact Sheet", variant: "default" },
  brochure: { label: "Brochure", variant: "info" },
  price_list: { label: "Price List", variant: "warning" },
  investment_sheet: { label: "Investment", variant: "success" },
  other: { label: "Other", variant: "muted" },
};

const extractionConfig: Record<ExtractionStatus, { label: string; icon: React.ReactNode; color: string }> = {
  completed: {
    label: "Extracted",
    icon: <CheckCircle className="w-3 h-3" />,
    color: "text-success-600",
  },
  pending: {
    label: "Extracting...",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    color: "text-warning-600",
  },
  failed: {
    label: "Failed",
    icon: <AlertCircle className="w-3 h-3" />,
    color: "text-error-500",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPropertyColor(name: string): string {
  const colors = [
    "from-brand-500 to-brand-400",
    "from-info-500 to-info-400",
    "from-success-500 to-success-400",
    "from-warning-500 to-warning-400",
    "from-error-500 to-error-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function PropertyCard({
  property,
  onView,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const docType = docTypeConfig[property.document_type];
  const extraction = extractionConfig[property.extraction_status];
  const gradientColor = getPropertyColor(property.name);

  return (
    <Card padding="none" hover className="overflow-hidden group">
      {/* Color Strip */}
      <div className={`h-1.5 bg-gradient-to-r ${gradientColor}`} />

      <div className="p-4 space-y-3.5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => onView?.(property)}
              className="text-left cursor-pointer group/title"
            >
              <h3 className="text-sm font-semibold text-text-primary truncate group-hover/title:text-brand-600 transition-colors">
                {property.name}
              </h3>
            </button>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={docType.variant}>{docType.label}</Badge>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${extraction.color}`}>
                {extraction.icon}
                {extraction.label}
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-7 h-7 rounded-md text-text-placeholder hover:bg-surface-hover hover:text-text-muted opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-surface-border rounded-xl shadow-lg py-1.5 z-30 animate-[scaleIn_150ms_ease-out] origin-top-right">
                  <MenuBtn
                    icon={<Eye className="w-3.5 h-3.5" />}
                    label="View"
                    onClick={() => { onView?.(property); setMenuOpen(false); }}
                  />
                  <MenuBtn
                    icon={<Pencil className="w-3.5 h-3.5" />}
                    label="Edit"
                    onClick={() => { onEdit?.(property); setMenuOpen(false); }}
                  />
                  <div className="my-1 border-t border-surface-border" />
                  <MenuBtn
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    label="Delete"
                    onClick={() => { onDelete?.(property); setMenuOpen(false); }}
                    danger
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {property.location && (
            <InfoChip
              icon={<MapPin className="w-3 h-3" />}
              value={property.location.split(",")[0]}
            />
          )}
          {property.price_range && (
            <InfoChip
              icon={<DollarSign className="w-3 h-3" />}
              value={property.price_range.split("–")[0].trim()}
            />
          )}
          {property.bedrooms && (
            <InfoChip
              icon={<BedDouble className="w-3 h-3" />}
              value={property.bedrooms}
            />
          )}
          {property.completion_date && (
            <InfoChip
              icon={<Calendar className="w-3 h-3" />}
              value={property.completion_date}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-surface-border">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-text-placeholder" />
            <span className="text-[10px] font-medium text-text-muted truncate max-w-[100px]">
              {property.developer || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-text-placeholder" />
            <span className="text-[10px] text-text-placeholder">
              {formatFileSize(property.file_size)} · {formatDate(property.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Sub Components ───────────────────────

function InfoChip({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface-muted rounded-md">
      <span className="text-text-placeholder shrink-0">{icon}</span>
      <span className="text-[11px] font-medium text-text-secondary truncate">
        {value}
      </span>
    </div>
  );
}

function MenuBtn({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 w-full px-3 py-1.5 text-sm transition-colors cursor-pointer
        ${danger ? "text-error-500 hover:bg-error-50" : "text-text-secondary hover:bg-surface-hover"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}