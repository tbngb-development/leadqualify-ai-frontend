"use client";

import clsx from "clsx";

// ─── FormField ─────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label className="block text-xs font-medium text-text-muted">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {children}

      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Shared input className strings ────────────────────────────────────────────

export const inputCn = (error?: string) =>
  clsx(
    "w-full px-3.5 py-2.5 rounded-xl",
    "bg-surface-muted border transition-all duration-200",
    "text-sm text-text-primary placeholder:text-text-muted",
    "focus:outline-none focus:ring-2",
    error
      ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
      : "border-surface-border focus:ring-brand-500/20 focus:border-brand-500",
  );

export const readOnlyCn = clsx(
  "w-full px-3.5 py-2.5 rounded-xl",
  "bg-surface-muted/70 border border-surface-border",
  "text-sm text-text-muted cursor-not-allowed select-none",
);

// ─── Section wrapper ───────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-white rounded-(--radius-card) border border-surface-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-border bg-surface-muted/40">
        <div>
          <h3 className="text-sm font-semibold font-sans text-text-primary uppercase tracking-wider">
            {title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Read-only info card (for selected entity details) ─────────────────────────

interface InfoCardProps {
  fields: Array<{ label: string; value: string | null | undefined }>;
}

export function InfoCard({ fields }: InfoCardProps) {
  const filtered = fields.filter((f) => f.value);
  if (filtered.length === 0) return null;

  return (
    <div className="mt-4 p-4 rounded-xl bg-brand-50/60 border border-brand-400">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {filtered.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">
              {label}
            </dt>
            <dd className="text-sm text-text-primary font-medium mt-0.5 truncate">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
        checked
          ? "bg-brand-50 border-brand-400"
          : "bg-surface-muted border-surface-border",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:border-brand-400 cursor-pointer",
      )}
    >
      <span className="text-left">
        <span className="block text-sm font-medium text-text-primary">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-text-muted mt-0.5">
            {description}
          </span>
        )}
      </span>

      {/* Track - Strong contrast in BOTH states */}
      <span
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 transition-colors duration-200 shadow-inner",
          checked
            ? "bg-brand-400 border-brand-500"
            : "bg-gray-300 border-brand-400", // ← Darker bg + darker border = visible!
        )}
      >
        {/* Thumb - with border so white stays visible */}
        <span
          className={clsx(
            "inline-block rounded-full bg-white shadow-md border border-gray-300 transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
          style={{ width: "18px", height: "18px" }}
        />
      </span>
    </button>
  );
}
