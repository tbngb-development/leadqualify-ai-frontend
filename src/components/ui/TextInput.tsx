"use client"

import clsx from "clsx";

export default function TextInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={clsx(
        "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all text-text-primary placeholder:text-text-muted bg-white",
        error
          ? "border-red-400 focus:ring-2 focus:ring-red-100"
          : "border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-50",
      )}
    />
  );
}
