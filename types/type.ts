export interface ApiSuccessResponse<T> {
  success: true;
  status?: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  status?: true;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;



export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ListResponse<T> {
  data?: {
    items: T[];
    meta?: PaginationMeta;
  };
}

export type StatusFilter = "all" | "active" | "inactive";
export type DatePreset = "all" | "today" | "last7" | "last30" | "custom";

export type SortBy = "latest" | "oldest";


