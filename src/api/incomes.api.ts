import type { IncomeRequest } from "../types/incomes.requests";
import type { GetIncomeResponse } from "../types/incomes.responses";
import { api } from "./client";

export async function getIncomes() {
  const res = await api.get<GetIncomeResponse>("/incomes");
  return res.data;
}

export async function createIncome(req: IncomeRequest) {
  const res = await api.post('/incomes', req);
  return res.data;
} 

export async function updateIncome(id: number, req: IncomeRequest) {
  const res = await api.put(`/incomes/${id}`, req)
  return res.data;
}

export async function deleteIncome(id: number) {
  const res = await api.delete(`/incomes/${id}`);
  return res.data;
}