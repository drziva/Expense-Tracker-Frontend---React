import type { ExpenseRequest } from "../types/expenses.requests";
import type { GetTransactionResponse } from "../types/transaction";
import { api } from "./client";

export async function getExpenses() {
  const res = await api.get<GetTransactionResponse>("/expenses");
  return res.data;
}

export async function createExpense(req: ExpenseRequest) {
  const res = await api.post('/expenses', req);
  return res.data;
} 

export async function updateExpense(id: number, req: ExpenseRequest) {
  const res = await api.put(`/expenses/${id}`, req)
  return res.data;
}

export async function deleteExpense(id: number) {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
}