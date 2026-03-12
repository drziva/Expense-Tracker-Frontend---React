import type { PaginatedResponse } from "@/shared/types/pagination";

export type IncomeGroup = {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: string;
}

export type GetIncomeGroupResponse = PaginatedResponse<IncomeGroup>;