import type { PaginatedResponse } from "./pagination";

export type Expense = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type GetExpenseResponse = PaginatedResponse<Expense>;
