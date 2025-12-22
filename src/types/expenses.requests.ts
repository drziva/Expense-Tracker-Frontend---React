import type { SortOption } from "./pagination";

export type ExpenseRequest = {
  description: string;
  amount: number;
  groupId: number;
}

export type ExpenseQuery = {
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
