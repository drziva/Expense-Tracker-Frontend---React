import type { PaginatedResponse } from "./pagination";

export type ExpenseGroup = {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: string;
  budgetCap?: number;
}

export type GetExpenseGroupResponse = PaginatedResponse<ExpenseGroup>;