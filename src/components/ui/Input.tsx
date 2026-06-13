// src/components/ui/Input.tsx

"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, fullWidth = true, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`space-y-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              px-3.5 py-2.5
              text-sm text-text-primary
              bg-surface
              border rounded-lg
              placeholder:text-text-placeholder
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted
              ${icon ? "pl-10" : ""}
              ${error
                ? "border-error-500 focus:ring-error-500/20 focus:border-error-500"
                : "border-surface-border"
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error-500 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error-500" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;