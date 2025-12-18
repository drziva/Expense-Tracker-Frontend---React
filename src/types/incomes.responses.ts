import type { PaginatedResponse } from "./pagination"

export type Income = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type GetIncomeResponse = PaginatedResponse<Income>;