import type { GroupSortOption } from "@/shared/types/pagination";

export type ExpenseGroupRequest = {
  name: string;
  description: string;
  budgetCap?: number | null;
}

 export type ExpenseGroupQuery = {
  from?: string;
  to?: string;
  sort?: GroupSortOption;
  search?: string;
  page?: number; 
  limit?: number;
 }
