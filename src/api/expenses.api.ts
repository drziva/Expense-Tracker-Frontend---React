import type { ExpenseQuery, ExpenseRequest, ExpenseSummaryQuery } from "../types/expenses.requests";
import type { ExpenseSummary, GetExpenseResponse } from "../types/expenses.responses";
import { api } from "./client";

export async function getExpenses(query: ExpenseQuery) {
  const res = await api.get<GetExpenseResponse>("/expenses", {params: query});
  return res.data;
}

export async function getExpenseSummary(query: ExpenseSummaryQuery) {
  const res = await api.get<ExpenseSummary[]>("/expenses/summary", {params: query});
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