// src/app/(dashboard)/calls/[id]/page.tsx

"use client";

import { CallStatusBadge } from "@/components/calls/CallStatusBadge";
import { TranscriptViewer } from "@/components/calls/TranscriptViewer";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { useCall, useCallTranscript } from "@/hooks/useCalls";
import { formatDateTime } from "@/lib/utils/formatDate";
import { formatDuration } from "@/lib/utils/formatDuration";
import {
  ChevronLeft,
  Clock,
  MessageSquare,
  Mic,
  Phone,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CallDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const { data: call, isLoading: callLoading } = useCall(id);
  console.log("call data: ", call);
  const { data: transcript, isLoading: transcriptLoading } =
    useCallTranscript(id);

  console.log("call transcript: ", transcript);

  if (callLoading) return <PageSpinner />;
  if (!call) return <p className="text-text-muted text-sm">Call not found.</p>;

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div>
        <Link
          href="/calls"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-3 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Calls
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-primary">
            Call with {call.lead.name}
          </h2>
          <CallStatusBadge status={call.status} />
        </div>
        <p className="text-sm text-text-muted mt-1">
          Campaign:{" "}
          <Link
            href={`/campaigns/${call.campaignId}`}
            className="text-brand-600 hover:underline"
          >
            {call.campaign.name}
          </Link>
        </p>
      </div>

      {/* Call info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card padding="sm" className="flex items-center gap-2.5">
          <User size={15} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Lead</p>
            <p className="text-sm font-medium text-text-primary">
              {call.lead.name}
            </p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-2.5">
          <Phone size={15} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Phone</p>
            <p className="text-sm font-medium text-text-primary font-mono">
              {call.lead.phone}
            </p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-2.5">
          <Clock size={15} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Duration</p>
            <p className="text-sm font-medium text-text-primary">
              {formatDuration(call.duration)}
            </p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-2.5">
          <Target size={15} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Outcome</p>
            <p className="text-sm font-medium text-text-primary">
              {call.outcome ?? "—"}
            </p>
          </div>
        </Card>
      </div>

      {/* Timestamps */}
      <Card padding="sm">
        <div className="flex items-center gap-6 text-xs text-text-muted">
          {call.startedAt && (
            <span>Started: {formatDateTime(call.startedAt)}</span>
          )}
          {call.endedAt && <span>Ended: {formatDateTime(call.endedAt)}</span>}
        </div>
      </Card>

      {/* Recording */}
      {call.recording && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Mic size={15} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-text-primary">
              Recording
            </h3>
          </div>
          <audio controls src={call.recording} className="w-full h-10" />
        </Card>
      )}

      {/* AI Summary */}
      {call.summary && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            AI Summary
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {call.summary}
          </p>
        </Card>
      )}

      {/* Transcript */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={15} className="text-brand-600" />
          <h3 className="text-sm font-semibold text-text-primary">
            Transcript
          </h3>
        </div>
        {transcriptLoading ? (
          <PageSpinner />
        ) : (
          <TranscriptViewer messages={transcript?.transcriptMessages ?? []} />
        )}
      </Card>
    </div>
  );
}
