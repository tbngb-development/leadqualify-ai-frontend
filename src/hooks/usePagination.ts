import { useState, useCallback } from "react";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  meta: PaginationMeta | null;
  setMeta: (meta: PaginationMeta) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  queryParams: { page: number; limit: number };
}

export const usePagination = (
  options: UsePaginationOptions = {}
): UsePaginationReturn => {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [page, setPageState] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1); // Reset to first page when limit changes
  }, []);

  return {
    page,
    limit,
    meta,
    setMeta,
    setPage,
    setLimit,
    queryParams: { page, limit },
  };
};