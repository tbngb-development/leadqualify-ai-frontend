"use client";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  showLimitSelector?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  className?: string;
  label?: string; // e.g., "countries", "users", "items"
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 25, 50, 100],
  showLimitSelector = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = "",
  label = "items",
}) => {
  const { total, page, limit, totalPages, hasNextPage, hasPreviousPage } = meta;

  // Calculate the range of items being displayed
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate visible page numbers
  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    // Adjust if we're near the beginning
    if (page <= half) {
      end = maxVisiblePages - 1;
    }

    // Adjust if we're near the end
    if (page > totalPages - half) {
      start = totalPages - maxVisiblePages + 2;
    }

    // Always show first page
    pages.push(1);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("ellipsis");
    }

    // Add middle pages
    for (let i = Math.max(2, start); i <= Math.min(totalPages - 1, end); i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`px-4 py-3 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
    >
      {/* Left: Showing info */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-text-muted whitespace-nowrap">
          Showing{" "}
          <span className="font-medium text-text-primary">
            {startItem}–{endItem}
          </span>{" "}
          of <span className="font-medium text-text-primary">{total}</span>{" "}
          {label}
        </p>

        {/* Limit selector (MVP - hidden)*/}
        {showLimitSelector && onLimitChange && (
          <div className=" hidden  items-center gap-2">
            <label
              htmlFor="page-limit"
              className="text-xs text-text-muted whitespace-nowrap"
            >
              Per page:
            </label>
            <select
              id="page-limit"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="text-xs border border-surface-border rounded-md px-2 py-1 
                         bg-surface-primary text-text-primary focus:outline-none 
                         focus:ring-2 focus:ring-primary-500"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-hover 
                     disabled:opacity-40 disabled:cursor-not-allowed 
                     transition-colors"
          aria-label="First page"
          title="First page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-hover cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed 
                     transition-colors"
          aria-label="Previous page"
          title="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {showPageNumbers &&
          getVisiblePages().map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs text-text-muted"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2 rounded-md text-xs font-medium cursor-pointer
                           transition-colors ${
                             p === page
                               ? "bg-primary-600 text-black shadow-sm"
                               : "text-text-muted hover:bg-surface-hover"
                           }`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-hover cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed 
                     transition-colors"
          aria-label="Next page"
          title="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-hover cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed 
                     transition-colors"
          aria-label="Last page"
          title="Last page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
