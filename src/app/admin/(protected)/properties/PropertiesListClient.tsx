// src/app/admin/(protected)/properties/PropertiesListClient.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Building2,
  Plus,
  Search,
  LayoutGrid,
  List,
  FileText,
  FileSpreadsheet,
  Clock,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusFilter from "@/components/ui/StatusFilter";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import PropertyCard from "@/components/properties/PropertyCard";
import { mockProperties, mockPropertyListStats } from "@/mocks/properties";
import type { Property, DocumentType, ExtractionStatus } from "@/types";
import { notFound, useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";

// ─── Config ───────────────────────────────

const docFilterOptions = [
  { value: "all", label: "All Types" },
  { value: "fact_sheet", label: "Fact Sheet", dot: "bg-brand-500" },
  { value: "brochure", label: "Brochure", dot: "bg-info-500" },
  { value: "price_list", label: "Price List", dot: "bg-warning-500" },
  { value: "investment_sheet", label: "Investment", dot: "bg-success-500" },
];

type ViewMode = "grid" | "list";
type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted"
  | "default";

const docTypeConfig: Record<
  DocumentType,
  { label: string; variant: BadgeVariant }
> = {
  fact_sheet: { label: "Fact Sheet", variant: "default" },
  brochure: { label: "Brochure", variant: "info" },
  price_list: { label: "Price List", variant: "warning" },
  investment_sheet: { label: "Investment", variant: "success" },
  other: { label: "Other", variant: "muted" },
};

const extractionConfig: Record<
  ExtractionStatus,
  { label: string; color: string }
> = {
  completed: { label: "Extracted", color: "text-success-600" },
  pending: { label: "Extracting...", color: "text-warning-600" },
  failed: { label: "Failed", color: "text-error-500" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

// ─── Page Component ───────────────────────

export default function PropertiesListClient() {
  const [properties] = useState<Property[]>(mockProperties);
  const stats = mockPropertyListStats;

  const [searchQuery, setSearchQuery] = useState("");
  const [docFilter, setDocFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // ─── Filtering ─────────────────────────
  const filteredProperties = useMemo(() => {
    let result = properties;

    if (docFilter !== "all") {
      result = result.filter((p) => p.document_type === docFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.developer?.toLowerCase().includes(q),
      );
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [properties, docFilter, searchQuery]);

  // ─── Handlers ──────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleUpload = () => {
    console.log("Navigate to upload property");
    router.push(ADMIN_ROUTES.PROPERTIES_UPLOAD);
  };

  const handleView = (property: Property) => {
    console.log("View property:", property.id);
    notFound()
  };

  const handleEdit = (property: Property) => {
    console.log("Edit property:", property.id);
  };

  const handleDeleteClick = (property: Property) => {
    setDeleteTarget(property);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsDeleting(false);
    setDeleteTarget(null);
    console.log("Deleted property:", deleteTarget.id);
  };

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* ─── Header ──────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Properties
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Manage property documents for AI calling campaigns
              </p>
            </div>
          </div>

          <Button icon={<Plus className="w-4 h-4" />} onClick={handleUpload}>
            Upload Property
          </Button>
        </div>

        {/* ─── Stats ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatMiniCard
            label="Total Properties"
            value={stats.total_properties}
            icon={<Building2 className="w-4.5 h-4.5" />}
            iconBg="bg-brand-50"
            iconColor="text-brand-500"
          />
          <StatMiniCard
            label="Fact Sheets"
            value={stats.fact_sheets}
            icon={<FileText className="w-4.5 h-4.5" />}
            iconBg="bg-info-50"
            iconColor="text-info-600"
          />
          <StatMiniCard
            label="Brochures"
            value={stats.brochures}
            icon={<FileSpreadsheet className="w-4.5 h-4.5" />}
            iconBg="bg-success-50"
            iconColor="text-success-600"
          />
          <StatMiniCard
            label="Pending Extraction"
            value={stats.pending_extraction}
            icon={<Clock className="w-4.5 h-4.5" />}
            iconBg="bg-warning-50"
            iconColor="text-warning-600"
            accent={
              stats.pending_extraction > 0 ? "text-warning-600" : undefined
            }
          />
        </div>

        {/* ─── Toolbar ─────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-placeholder" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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

            {/* Doc Type Filter */}
            <StatusFilter
              options={docFilterOptions}
              value={docFilter}
              onChange={setDocFilter}
              placeholder="All Types"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-surface-subtle rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-surface text-text-primary shadow-xs"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-surface text-text-primary shadow-xs"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Count ───────────────────────── */}
        <p className="text-xs text-text-muted">
          Showing{" "}
          <span className="font-medium text-text-secondary">
            {filteredProperties.length}
          </span>{" "}
          {filteredProperties.length === 1 ? "property" : "properties"}
        </p>

        {/* ─── Content ─────────────────────── */}
        {filteredProperties.length > 0 ? (
          viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-muted border-b border-surface-border">
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">
                        Location
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
                        Price Range
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">
                        Created
                      </th>
                      <th className="px-5 py-3 w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {filteredProperties.map((property) => {
                      const docType = docTypeConfig[property.document_type];
                      const extraction =
                        extractionConfig[property.extraction_status];

                      return (
                        <tr
                          key={property.id}
                          className="group hover:bg-surface-muted transition-colors duration-100"
                        >
                          {/* Property */}
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleView(property)}
                              className="text-left cursor-pointer"
                            >
                              <p className="text-sm font-medium text-text-primary group-hover:text-brand-600 transition-colors">
                                {property.name}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5">
                                {property.developer} · {property.property_type}
                              </p>
                            </button>
                          </td>

                          {/* Location */}
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className="text-sm text-text-secondary">
                              {property.location?.split(",")[0] || "—"}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <span className="text-sm text-text-secondary">
                              {property.price_range?.split("–")[0].trim() ||
                                "—"}
                            </span>
                          </td>

                          {/* Doc Type */}
                          <td className="px-5 py-3.5">
                            <Badge variant={docType.variant}>
                              {docType.label}
                            </Badge>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span
                              className={`text-xs font-medium ${extraction.color}`}
                            >
                              {extraction.label}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <span className="text-sm text-text-muted">
                              {formatDate(property.created_at)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(property)}
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        ) : (
          /* Empty State */
          <Card>
            <EmptyState
              icon={<Building2 className="w-7 h-7" />}
              title={
                searchQuery || docFilter !== "all"
                  ? "No properties match your filters"
                  : "No properties yet"
              }
              description={
                searchQuery || docFilter !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Upload your first property document to start creating AI calling campaigns."
              }
              actionLabel={
                searchQuery || docFilter !== "all"
                  ? undefined
                  : "Upload Property"
              }
              onAction={
                searchQuery || docFilter !== "all" ? undefined : handleUpload
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
        title="Delete Property"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Any campaigns using this property will be affected. This action cannot be undone.`}
        confirmLabel="Delete Property"
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
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
