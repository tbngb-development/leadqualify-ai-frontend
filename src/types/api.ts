/**
 * Pagination metadata from API
 */
export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Validation error from API
 */
export interface ApiValidationError {
  field: string;
  message: string;
}

/**
 * Standard API Response
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errors?: ApiValidationError[];
  meta?: ApiMeta;
}

/**
 * Base Query Options
 */
export interface IBaseQueryOptions {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  orderDir?: "asc" | "desc";
  includeDeleted?: boolean;
}
