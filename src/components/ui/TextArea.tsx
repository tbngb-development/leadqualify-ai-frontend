// src/components/ui/TextArea.tsx

"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, fullWidth = true, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`space-y-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full
            px-3.5 py-2.5
            text-sm text-text-primary
            bg-surface
            border rounded-lg
            placeholder:text-text-placeholder
            transition-all duration-150
            resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted
            ${error
              ? "border-error-500 focus:ring-error-500/20 focus:border-error-500"
              : "border-surface-border"
            }
            ${className}
          `}
          {...props}
        />
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

TextArea.displayName = "TextArea";
export default TextArea;