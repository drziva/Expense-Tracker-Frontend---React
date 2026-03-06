import { SortOption } from "./pagination";

export type SummaryType = "regular" | "yearly";

export type IncomeRequest = {
  description: string;
  amount: number;
  groupId: number;
}

export type IncomeSummaryQuery = {
  from?: string;
  to?: string;
  type: SummaryType
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
