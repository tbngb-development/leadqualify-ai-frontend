// src/app/(dashboard)/campaigns/[id]/calls/page.tsx

'use client';

import { CallsTable } from '@/components/calls/CallsTable';
import { PageSpinner } from '@/components/ui/Spinner';
import { useCalls } from '@/hooks/useCalls';
import { usePagination } from '@/hooks/usePagination';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CampaignCallsPage() {
  const params = useParams();
  const campaignId = String(params.id);
  const { page, setPage } = usePagination();

  const { data, isLoading } = useCalls({ campaignId, page, limit: 20 });
  console.log("call data: ", data)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href={`/campaigns/${campaignId}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-3 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Campaign
        </Link>
        <h2 className="text-lg font-semibold text-text-primary">
          Campaign Calls
        </h2>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <CallsTable
          calls={data?.calls ?? []}
          pagination={data?.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}