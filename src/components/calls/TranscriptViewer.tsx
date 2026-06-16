// src/components/calls/TranscriptViewer.tsx

import type { TranscriptMessage } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Bot, User } from "lucide-react";
import { formatTranscriptDuration } from "@/lib/utils/formatDate";

interface TranscriptViewerProps {
  messages: TranscriptMessage[];
}

export function TranscriptViewer({ messages }: TranscriptViewerProps) {
  if (messages.length === 0) {
    return (
      <p className="text-sm text-text-muted text-center py-8">
        No transcript available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto thin-scrollbar pr-1">
      {messages.map((msg, idx) => {
        const isAssistant = msg.role === "assistant";
        return (
          <div
            key={idx}
            className={cn(
              "flex gap-2.5",
              isAssistant ? "flex-row" : "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full shrink-0 mt-0.5",
                isAssistant
                  ? "bg-brand-100 text-brand-600"
                  : "bg-surface-subtle text-text-muted",
              )}
            >
              {isAssistant ? <Bot size={13} /> : <User size={13} />}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3.5 py-2.5",
                isAssistant
                  ? "bg-brand-50 text-text-primary rounded-tl-none"
                  : "bg-surface-subtle text-text-primary rounded-tr-none",
              )}
            >
              <p className="text-xs font-medium text-text-muted mb-1">
                {isAssistant ? "AI Assistant" : "Lead"}
              </p>
              <p className="text-sm text-text-primary leading-relaxed">
                {msg.message}
              </p>
              {msg.time && (
                <p className="text-xs text-text-placeholder mt-1 text-right">
                  {formatTranscriptDuration(msg.secondsFromStart)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
