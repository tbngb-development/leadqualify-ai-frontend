"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import type { SearchableOption } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SearchableDropdownProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: SearchableOption | null;
  onChange: (option: SearchableOption | null) => void;
  onSearch: (query: string) => void;
  options: SearchableOption[];
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
  emptyMessage?: string;
  className?: string;
  /**
   * When true the parent is responsible for filtering `options`
   * (e.g. async server search). When false (default) the component
   * filters the passed `options` list itself using the search query.
   */
  externalFilter?: boolean;
}

// ─── Portal Dropdown ───────────────────────────────────────────────────────────

interface DropdownPortalProps {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  listRef: React.RefObject<HTMLUListElement | null>;
  children: (maxHeight: number) => React.ReactNode;
}

function DropdownPortal({
  anchorRef,
  isOpen,
  listRef,
  children,
}: DropdownPortalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const PREFERRED_MAX_HEIGHT = 410;

  const [styles, setStyles] = useState<React.CSSProperties>({
    position: "fixed",
    opacity: 0,
    pointerEvents: "none",
  });
  const [listMaxHeight, setListMaxHeight] = useState(PREFERRED_MAX_HEIGHT);

  useEffect(() => {
    if (!isOpen || !anchorRef.current) {
      setStyles((s) => ({ ...s, opacity: 0, pointerEvents: "none" }));
      return;
    }

    function calculate() {
      if (!anchorRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const gap = 6;

      const spaceBelow = viewportHeight - anchorRect.bottom - gap;
      const spaceAbove = anchorRect.top - gap;

      let top: number;
      let resolvedMaxHeight: number;

      if (spaceBelow >= PREFERRED_MAX_HEIGHT) {
        top = anchorRect.bottom + gap;
        resolvedMaxHeight = PREFERRED_MAX_HEIGHT;
      } else if (spaceAbove > spaceBelow) {
        resolvedMaxHeight = Math.min(spaceAbove, PREFERRED_MAX_HEIGHT);
        top = anchorRect.top - gap - resolvedMaxHeight;
      } else {
        top = anchorRect.bottom + gap;
        resolvedMaxHeight = Math.max(spaceBelow, 120);
      }

      setListMaxHeight(resolvedMaxHeight);
      setStyles({
        position: "fixed",
        top,
        left: anchorRect.left,
        width: anchorRect.width,
        zIndex: 9999,
        opacity: 1,
        pointerEvents: "auto",
      });
    }

    calculate();
    const raf = requestAnimationFrame(calculate);

    window.addEventListener("scroll", calculate, true);
    window.addEventListener("resize", calculate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", calculate, true);
      window.removeEventListener("resize", calculate);
    };
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return createPortal(
    <div ref={dropdownRef} style={styles}>
      {children(listMaxHeight)}
    </div>,
    document.body,
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the option matches every word in the query.
 * Searches both label and sublabel (if present).
 */
function matchesQuery(option: SearchableOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const words = q.split(/\s+/).filter(Boolean);
  const haystack = [option.label, option.sublabel ?? ""]
    .join(" ")
    .toLowerCase();

  // Every word must appear somewhere in the combined text
  return words.every((word) => haystack.includes(word));
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const words = trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  // Reset lastIndex between calls since we reuse the regex
  return parts.map((part, i) => {
    regex.lastIndex = 0;
    return regex.test(part) ? (
      <mark
        key={i}
        className="bg-brand-100 text-brand-700 rounded-sm px-0.5 not-italic font-semibold"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function SearchableDropdown({
  label,
  required,
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  options,
  isLoading = false,
  error,
  disabled = false,
  emptyMessage = "No results found",
  className,
  externalFilter = false,
}: SearchableDropdownProps) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Filter options internally unless parent handles it ────────────────────
  const filteredOptions = externalFilter
    ? options
    : options.filter((opt) => matchesQuery(opt, query));

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      const portalList = listRef.current;

      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!portalList || !portalList.contains(target))
      ) {
        setIsOpen(false);
        setQuery("");
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // ── Reset active index when filtered list changes ─────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(-1);
  }, [filteredOptions.length]);

  // ── Scroll active option into view ────────────────────────────────────────
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setQuery("");
    setActiveIndex(-1);
    onSearch("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [disabled, onSearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setQuery(q);
      setActiveIndex(-1);
      onSearch(q); // still notify parent (useful for async search)
    },
    [onSearch],
  );

  const handleSelect = useCallback(
    (option: SearchableOption) => {
      onChange(option);
      setIsOpen(false);
      setQuery("");
      setActiveIndex(-1);
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
      setQuery("");
      onSearch("");
    },
    [onChange, onSearch],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          openDropdown();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filteredOptions[activeIndex]) {
            handleSelect(filteredOptions[activeIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setQuery("");
          setActiveIndex(-1);
          break;
        case "Tab":
          setIsOpen(false);
          setQuery("");
          break;
      }
    },
    [isOpen, filteredOptions, activeIndex, openDropdown, handleSelect],
  );

  const hasValue = !!value;

  return (
    <div className={clsx("relative", className)} ref={containerRef}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-xs font-medium text-text-muted mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Trigger / selected display */}
      {!isOpen ? (
        <button
          type="button"
          id={id}
          onClick={openDropdown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={false}
          onKeyDown={handleKeyDown}
          className={clsx(
            "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-left",
            "border transition-all duration-200",
            error
              ? "border-red-400 bg-red-50/50 focus:ring-red-400/20"
              : "border-surface-border bg-surface-muted focus:ring-brand-500/20 focus:border-brand-500",
            "focus:outline-none focus:ring-2",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {hasValue ? (
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-text-primary truncate">
                {value.label}
              </span>
              {value.sublabel && (
                <span className="block text-xs text-text-muted truncate mt-0.5">
                  {value.sublabel}
                </span>
              )}
            </span>
          ) : (
            <span className="text-sm text-text-muted flex-1">
              {placeholder}
            </span>
          )}

          <span className="flex items-center gap-1 shrink-0">
            {hasValue && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleClear(e as unknown as React.MouseEvent)
                }
                className="p-0.5 rounded-md hover:bg-surface-border text-text-muted hover:text-text-primary transition-colors"
                aria-label="Clear selection"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            )}
            <svg
              className="w-4 h-4 text-text-muted transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>
      ) : (
        /* Search input */
        <div
          className={clsx(
            "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl",
            "border border-brand-500 bg-white ring-2 ring-brand-500/20",
          )}
        >
          <svg
            className="w-4 h-4 text-brand-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 text-sm bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
            autoComplete="off"
            role="combobox"
            aria-controls={`${id}-listbox`}
            aria-expanded={true}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
            }
          />
          {isLoading && (
            <svg
              className="w-4 h-4 text-brand-400 animate-spin shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          )}
        </div>
      )}

      {/* ── Portal dropdown ── */}
      <DropdownPortal
        anchorRef={containerRef}
        isOpen={isOpen}
        listRef={listRef}
      >
        {(listMaxHeight) => (
          <div
            className={clsx(
              "rounded-xl border border-surface-border",
              "bg-white shadow-lg shadow-black/5 overflow-hidden",
            )}
          >
            <ul
              ref={listRef}
              id={`${id}-listbox`}
              role="listbox"
              aria-label={label}
              style={{ maxHeight: listMaxHeight }}
              className="overflow-y-auto py-1.5 divide-y divide-surface-border/50 dropdown-scrollbar"
            >
              {isLoading && filteredOptions.length === 0 ? (
                <li className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                  <svg
                    className="w-4 h-4 animate-spin text-brand-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Searching...
                </li>
              ) : filteredOptions.length === 0 ? (
                <li className="px-4 py-6 text-sm text-text-muted text-center">
                  <span className="block mb-1">🔍</span>
                  {query.trim()
                    ? `No results for "${query.trim()}"`
                    : emptyMessage}
                </li>
              ) : (
                filteredOptions.map((option, i) => (
                  <li
                    key={option.value}
                    id={`${id}-option-${i}`}
                    role="option"
                    aria-selected={value?.value === option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={clsx(
                      "flex items-start gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100",
                      i === activeIndex
                        ? "bg-brand-50"
                        : "hover:bg-surface-muted/70",
                      value?.value === option.value && "bg-brand-50/80",
                    )}
                  >
                    <span className="mt-0.5 w-4 shrink-0">
                      {value?.value === option.value && (
                        <svg
                          className="w-4 h-4 text-brand-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-text-primary">
                        {highlightMatch(option.label, query)}
                      </span>
                      {option.sublabel && (
                        <span className="block text-xs text-text-muted mt-0.5">
                          {highlightMatch(option.sublabel, query)}
                        </span>
                      )}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </DropdownPortal>

      {/* Error */}
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
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
