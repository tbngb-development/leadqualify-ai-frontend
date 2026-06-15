// src/components/calls/CallsTable.tsx

'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { CallStatusBadge } from './CallStatusBadge';
import { formatDateTime } from '@/lib/utils/formatDate';
import { formatDuration } from '@/lib/utils/formatDuration';
import type { Call, PaginationMeta } from '@/types';
import { Phone } from 'lucide-react';
import Link from 'next/link';

interface CallsTableProps {
  calls: Call[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export function CallsTable({ calls, pagination, onPageChange }: CallsTableProps) {
  if (calls.length === 0) {
    return (
      <EmptyState
        icon={<Phone size={22} />}
        title="No calls yet"
        description="Start a campaign to see calls here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface rounded-lg border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-subtle">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Lead
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Phone
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Campaign
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Duration
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {calls.map((call) => (
                <tr
                  key={call.id}
                  className="hover:bg-surface-hover transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/calls/${call.id}`}
                      className="font-medium text-text-primary hover:text-brand-600 transition-colors"
                    >
                      {call.lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                    {call.lead.phone}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/campaigns/${call.campaignId}`}
                      className="text-text-muted hover:text-brand-600 text-xs transition-colors"
                    >
                      {call.campaign.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <CallStatusBadge status={call.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {formatDuration(call.duration)}
                  </td>
                  <td className="px-5 py-3 text-text-muted text-xs">
                    {formatDateTime(call.startedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && onPageChange && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Showing {calls.length} of {pagination.total} calls
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}