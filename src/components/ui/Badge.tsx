// src/components/ui/Badge.tsx

import { type ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-brand-100 text-brand-600",
  success:
    "bg-success-50 text-success-600",
  warning:
    "bg-warning-50 text-warning-600",
  error:
    "bg-error-50 text-error-600",
  info:
    "bg-info-50 text-info-600",
  muted:
    "bg-surface-subtle text-text-muted",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
  info: "bg-info-500",
  muted: "bg-text-muted",
};

export default function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-0.5
        text-xs font-medium
        rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            inline-block w-1.5 h-1.5 rounded-full
            ${dotStyles[variant]}
          `}
        />
      )}
      {children}
    </span>
  );
}