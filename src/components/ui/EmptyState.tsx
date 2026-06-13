// src/components/ui/EmptyState.tsx

import { type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-surface-subtle border border-surface-border flex items-center justify-center text-text-placeholder">
          {icon}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface border-2 border-surface-border flex items-center justify-center">
          <Plus className="w-3 h-3 text-text-placeholder" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-muted max-w-sm leading-relaxed mb-5">
        {description}
      </p>

      {/* Action */}
      {actionLabel && onAction && (
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={onAction}
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}