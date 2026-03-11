import type { PaginatedResponse } from "./pagination"

export type Income = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type IncomeSummary = {
  date: string;
  total: number;
}

export type GetIncomeResponse = PaginatedResponse<Income>;