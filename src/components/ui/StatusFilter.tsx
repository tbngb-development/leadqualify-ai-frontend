// src/components/ui/StatusFilter.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface StatusOption {
  value: string;
  label: string;
  dot?: string;
}

interface StatusFilterProps {
  options: StatusOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function StatusFilter({
  options,
  value,
  onChange,
  placeholder = "All Status",
}: StatusFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2
          px-3.5 py-2
          text-sm font-medium
          bg-surface
          border rounded-lg
          transition-all duration-150
          cursor-pointer
          ${
            open
              ? "border-brand-500 ring-2 ring-brand-500/20"
              : "border-surface-border hover:border-brand-300"
          }
          ${selected && value !== "all" ? "text-text-primary" : "text-text-muted"}
        `}
      >
        {selected?.dot && (
          <span
            className={`inline-block w-2 h-2 rounded-full ${selected.dot}`}
          />
        )}
        <span>{selected?.label || placeholder}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-placeholder transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-48 bg-surface border border-surface-border rounded-xl shadow-lg py-1.5 z-30 animate-[scaleIn_150ms_ease-out]">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  flex items-center gap-2.5 w-full
                  px-3.5 py-2
                  text-sm
                  transition-colors duration-100
                  cursor-pointer
                  ${
                    isSelected
                      ? "text-brand-600 bg-brand-50 font-medium"
                      : "text-text-secondary hover:bg-surface-hover"
                  }
                `}
              >
                {option.dot && (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${option.dot}`}
                  />
                )}
                <span className="flex-1 text-left">{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-brand-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}