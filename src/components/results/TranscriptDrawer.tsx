// src/components/results/TranscriptDrawer.tsx

"use client";

import { useEffect, useRef } from "react";
import {
  X,
  Phone,
  Clock,
  Calendar,
  Flame,
  Sun,
  Snowflake,
  ThumbsDown,
  CheckCircle,
  XCircle,
  MessageSquare,
  Bot,
  User,
  Headphones,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { CallResultDetail } from "@/mocks/call-results";
import type { InterestLevel } from "@/types";

interface TranscriptDrawerProps {
  result: CallResultDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Config ───────────────────────────────

type BadgeVariant = "success" | "warning" | "error" | "info" | "muted" | "default";

const interestConfig: Record<
  InterestLevel,
  {
    label: string;
    variant: BadgeVariant;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }
> = {
  hot: {
    label: "Hot Lead",
    variant: "error",
    icon: <Flame className="w-4 h-4" />,
    color: "text-error-600",
    bg: "bg-error-50",
  },
  warm: {
    label: "Warm Lead",
    variant: "warning",
    icon: <Sun className="w-4 h-4" />,
    color: "text-warning-600",
    bg: "bg-warning-50",
  },
  cold: {
    label: "Cold Lead",
    variant: "info",
    icon: <Snowflake className="w-4 h-4" />,
    color: "text-info-600",
    bg: "bg-info-50",
  },
  not_interested: {
    label: "Not Interested",
    variant: "muted",
    icon: <ThumbsDown className="w-4 h-4" />,
    color: "text-text-muted",
    bg: "bg-surface-subtle",
  },
};

// ─── Helpers ──────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPhone(phone: string): string {
  if (phone.startsWith("+971") && phone.length >= 12) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  }
  return phone;
}

// ─── Score Ring ────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = "stroke-text-muted";
  if (score >= 80) strokeColor = "stroke-success-500";
  else if (score >= 50) strokeColor = "stroke-warning-500";
  else if (score >= 20) strokeColor = "stroke-info-500";

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          className="stroke-surface-subtle"
          strokeWidth="5"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          className={`${strokeColor} transition-all duration-700 ease-out`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-text-primary tabular-nums">
          {score}
        </span>
      </div>
    </div>
  );
}

// ─── Qualification Item ───────────────────

function QualItem({
  label,
  value,
  positive,
}: {
  label: string;
  value: boolean;
  positive: boolean;
}) {
  const isGood = value === positive;
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        {value ? (
          <CheckCircle
            className={`w-4 h-4 ${isGood ? "text-success-500" : "text-warning-500"}`}
          />
        ) : (
          <XCircle
            className={`w-4 h-4 ${isGood ? "text-text-placeholder" : "text-error-400"}`}
          />
        )}
        <span
          className={`text-sm font-medium ${
            value ? (isGood ? "text-success-600" : "text-warning-600") : "text-text-muted"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────

export default function TranscriptDrawer({
  result,
  isOpen,
  onClose,
}: TranscriptDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!result) return null;

  const interest = interestConfig[result.interest_level];
  const qual = result.qualification_data;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/30 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 right-0 z-50
          h-full w-full max-w-xl
          bg-surface
          border-l border-surface-border
          shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* ─── Header ──────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${interest.bg} ${interest.color} shrink-0`}>
              {interest.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-text-primary truncate">
                {result.first_name} {result.last_name}
              </h2>
              <p className="text-xs text-text-muted">
                {result.campaign_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Scrollable Content ──────────── */}
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          {/* Lead Info + Score */}
          <div className="px-6 py-5 border-b border-surface-border">
            <div className="flex items-start gap-5">
              <ScoreRing score={result.qualification_score} />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Qualification Score</p>
                  <Badge variant={interest.variant} dot className="mt-1">
                    {interest.label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MetaItem
                    icon={<Phone className="w-3.5 h-3.5" />}
                    label="Phone"
                    value={formatPhone(result.phone)}
                  />
                  <MetaItem
                    icon={<Clock className="w-3.5 h-3.5" />}
                    label="Duration"
                    value={formatDuration(result.call_duration)}
                  />
                  <MetaItem
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    label="Called"
                    value={formatDate(result.call_initiated_at)}
                  />
                  {result.recording_url && (
                    <MetaItem
                      icon={<Headphones className="w-3.5 h-3.5" />}
                      label="Recording"
                      value="Available"
                      isLink
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="px-6 py-5 border-b border-surface-border">
            <SectionHeader
              icon={<Bot className="w-4 h-4" />}
              title="AI Summary"
            />
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              {result.summary}
            </p>
          </div>

          {/* Qualification Data */}
          <div className="px-6 py-5 border-b border-surface-border">
            <SectionHeader
              icon={<CheckCircle className="w-4 h-4" />}
              title="Qualification Details"
            />
            <div className="mt-3 space-y-0 divide-y divide-surface-border">
              <QualItem label="Interested" value={qual.is_interested} positive />
              <QualItem label="Requested Callback" value={qual.requested_callback} positive />
              <QualItem label="Budget Confirmed" value={qual.budget_confirmed} positive />

              {qual.budget_mentioned && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">Budget</span>
                  <span className="text-sm font-medium text-text-primary">
                    {qual.budget_mentioned}
                  </span>
                </div>
              )}
              {qual.timeline && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">Timeline</span>
                  <span className="text-sm font-medium text-text-primary">
                    {qual.timeline}
                  </span>
                </div>
              )}
              {qual.purpose && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">Purpose</span>
                  <span className="text-sm font-medium text-text-primary capitalize">
                    {qual.purpose}
                  </span>
                </div>
              )}
            </div>

            {/* Objections */}
            {qual.objections.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                  Objections
                </p>
                <div className="space-y-1.5">
                  {qual.objections.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-warning-500 shrink-0 mt-0.5" />
                      {obj}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Questions */}
            {qual.key_questions.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                  Questions Asked
                </p>
                <div className="space-y-1.5">
                  {qual.key_questions.map((q, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="px-6 py-5">
            <SectionHeader
              icon={<MessageSquare className="w-4 h-4" />}
              title="Full Transcript"
            />
            <div className="mt-4 space-y-4">
              {result.transcript_json.map((turn, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    turn.role === "assistant" ? "" : "flex-row-reverse"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`
                      flex items-center justify-center
                      w-7 h-7 rounded-full shrink-0 mt-0.5
                      ${
                        turn.role === "assistant"
                          ? "bg-brand-100 text-brand-600"
                          : "bg-surface-subtle text-text-muted"
                      }
                    `}
                  >
                    {turn.role === "assistant" ? (
                      <Bot className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`
                      max-w-[85%] px-3.5 py-2.5 rounded-2xl
                      ${
                        turn.role === "assistant"
                          ? "bg-surface-muted rounded-tl-sm"
                          : "bg-brand-50 rounded-tr-sm"
                      }
                    `}
                  >
                    <p className="text-sm text-text-primary leading-relaxed">
                      {turn.message}
                    </p>
                    <p
                      className={`text-[10px] mt-1 tabular-nums ${
                        turn.role === "assistant"
                          ? "text-text-placeholder"
                          : "text-brand-400"
                      }`}
                    >
                      {formatTimestamp(turn.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Footer ──────────────────────── */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-surface-border shrink-0 bg-surface-muted">
          {result.recording_url && (
            <Button variant="secondary" size="sm" icon={<Headphones className="w-3.5 h-3.5" />}>
              Play Recording
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Sub Components ───────────────────────

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted">{icon}</span>
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-text-placeholder mb-0.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-xs font-medium ${
          isLink ? "text-brand-500" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}