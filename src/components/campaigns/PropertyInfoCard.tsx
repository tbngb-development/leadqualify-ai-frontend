// src/components/campaigns/PropertyInfoCard.tsx

"use client";

import {
  MapPin,
  DollarSign,
  Building2,
  BedDouble,
  Calendar,
  User,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { Property } from "@/types";

interface PropertyInfoCardProps {
  property: Property;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-muted text-text-muted shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function PropertyInfoCard({ property }: PropertyInfoCardProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-success-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-success-100 text-success-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Property Information Extracted
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              AI has extracted the following details from your document
            </p>
          </div>
        </div>
        <Badge variant="success" dot>
          Extracted
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Property Name & Type */}
        <div>
          <h4 className="text-lg font-bold text-text-primary">
            {property.name}
          </h4>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="default">{property.property_type}</Badge>
            {property.developer && (
              <span className="text-xs text-text-muted">
                by {property.developer}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Description
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {property.description}
            </p>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {property.location && (
            <InfoRow
              icon={<MapPin className="w-4 h-4" />}
              label="Location"
              value={property.location}
            />
          )}
          {property.price_range && (
            <InfoRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Price Range"
              value={property.price_range}
            />
          )}
          {property.bedrooms && (
            <InfoRow
              icon={<BedDouble className="w-4 h-4" />}
              label="Bedrooms"
              value={property.bedrooms}
            />
          )}
          {property.completion_date && (
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Completion"
              value={property.completion_date}
            />
          )}
          {property.developer && (
            <InfoRow
              icon={<User className="w-4 h-4" />}
              label="Developer"
              value={property.developer}
            />
          )}
          {property.property_type && (
            <InfoRow
              icon={<Building2 className="w-4 h-4" />}
              label="Property Type"
              value={property.property_type}
            />
          )}
        </div>

        {/* Payment Plan */}
        {property.payment_plan && (
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Payment Plan
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(property.payment_plan).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-muted rounded-lg border border-surface-border"
                >
                  <span className="text-sm font-semibold text-brand-600">
                    {value}
                  </span>
                  <span className="text-xs text-text-muted capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Amenities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="
                    inline-flex items-center gap-1.5
                    px-2.5 py-1
                    text-xs font-medium
                    text-text-secondary
                    bg-surface-muted
                    border border-surface-border
                    rounded-full
                  "
                >
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}