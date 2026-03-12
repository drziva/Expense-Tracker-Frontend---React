import type { PaginatedResponse } from "@/shared/types/pagination";

export type Expense = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type ExpenseSummary = {
  date: string;
  total: number;
}

export type ExpenseTotalByGroup = {
  groupName: string,
  total: number
}

export type GetExpenseResponse = PaginatedResponse<Expense>;
