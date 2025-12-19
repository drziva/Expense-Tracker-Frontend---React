import type { GroupSortOption, SortOption } from "./pagination";

export type IncomeGroupRequest = {
  name: string;
  description: string;
}

export type IncomeQuery = {
  min?: number;
  max?: number;
  from?: string;
  to?: string;
  group_id?: number;
  search?: string;
  page: number;
  limit: number;
  sort?: SortOption;
 }

 export type IncomeGroupQuery = {
  from?: string;
  to?: string;
  sort?: GroupSortOption;
  search?: string;
  page?: number;
  limit?: number;
 }
