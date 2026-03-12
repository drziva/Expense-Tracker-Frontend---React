import type { SortOption } from "@/shared/types/pagination";

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

export type ExpenseGroupSummaryQuery = {
  from?: string;
  to?: string;
}

export type ExpenseSummaryQuery = {
  from?: string;
  to?: string;
  type: "regular" | "yearly";
}