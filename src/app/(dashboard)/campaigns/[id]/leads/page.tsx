// src/app/(dashboard)/campaigns/[id]/leads/page.tsx

"use client";

import { LeadsTable } from "@/components/leads/LeadsTable";
import { PageSpinner } from "@/components/ui/Spinner";
import { useLeads } from "@/hooks/useLeads";
import { usePagination } from "@/hooks/usePagination";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CampaignLeadsPage() {
  const params = useParams();
  const campaignId = String(params.id);
  const { page, setPage } = usePagination();

  const { data, isLoading } = useLeads({ campaignId, page, limit: 20 });
  console.log("leads data: ", data);
  console.log("pagination: ", data?.pagination);

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
          Campaign Leads
        </h2>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <LeadsTable
          leads={data?.leads ?? []}
          pagination={data?.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
