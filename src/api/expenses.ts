import { api } from "./client";

export type Expense = {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type GetExpensesResponse = {
  data: Expense[];
  page:number;
  limit:number;
  totalItems: number;
  totalPages: number;
};

export async function getExpenses(): Promise<GetExpensesResponse> {
  const res = await api.get<GetExpensesResponse>("/expenses");
  return res.data;
}