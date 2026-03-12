import type { GroupSortOption, SortOption } from "@/shared/types/pagination";

export type IncomeGroupRequest = {
  name: string;
  description: string;
}

export type IncomeGroupSummaryQuery = {
  from?: string;
  to?: string;
}

export type IncomeGroupQuery = {
  from?: string;
  to?: string;
  sort?: GroupSortOption;
  search?: string;
  page?: number;
  limit?: number;
}
