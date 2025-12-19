export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type SortOption =
  | "amount_asc"
  | "amount_desc"
  | "date_asc"
  | "date_desc";

export type GroupSortOption =
  | "name_asc"
  | "name_desc"
  | "date_asc"
  | "date_desc";
