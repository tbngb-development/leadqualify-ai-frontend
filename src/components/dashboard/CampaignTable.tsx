// src/components/dashboard/CampaignTable.tsx

import { type Campaign, type CampaignStatus } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Eye, MoreHorizontal, Play, Pause } from "lucide-react";

interface CampaignTableProps {
  campaigns: Campaign[];
  onView?: (campaign: Campaign) => void;
}

const statusConfig: Record<
  CampaignStatus,
  { label: string; variant: "success" | "warning" | "error" | "info" | "muted" }
> = {
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  completed: { label: "Completed", variant: "info" },
  draft: { label: "Draft", variant: "muted" },
  failed: { label: "Failed", variant: "error" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProgressBar({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-text-muted tabular-nums w-8 text-right">
        {percentage}%
      </span>
    </div>
  );
}

export default function CampaignTable({
  campaigns,
  onView,
}: CampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-sm">No campaigns found</p>
        <p className="text-text-placeholder text-xs mt-1">
          Create your first campaign to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Head */}
        <thead>
          <tr className="border-b border-surface-border">
            {[
              "Campaign",
              "Property",
              "Leads",
              "Progress",
              "Status",
              "Created",
              "",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-surface-border">
          {campaigns.map((campaign) => {
            const status = statusConfig[campaign.status];

            return (
              <tr
                key={campaign.id}
                className="group hover:bg-surface-muted transition-colors duration-100"
              >
                {/* Campaign Name */}
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {campaign.calls_completed.toLocaleString()} /{" "}
                      {campaign.total_leads.toLocaleString()} calls
                    </p>
                  </div>
                </td>

                {/* Property */}
                <td className="px-4 py-3.5">
                  <span className="text-sm text-text-secondary">
                    {campaign.property_name || "—"}
                  </span>
                </td>

                {/* Leads Count */}
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-text-primary tabular-nums">
                    {campaign.total_leads.toLocaleString()}
                  </span>
                </td>

                {/* Progress */}
                <td className="px-4 py-3.5">
                  <ProgressBar
                    completed={campaign.calls_completed}
                    total={campaign.total_leads}
                  />
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <Badge variant={status.variant} dot>
                    {status.label}
                  </Badge>
                </td>

                {/* Created Date */}
                <td className="px-4 py-3.5">
                  <span className="text-sm text-text-muted">
                    {formatDate(campaign.created_at)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => onView?.(campaign)}
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
  );
}