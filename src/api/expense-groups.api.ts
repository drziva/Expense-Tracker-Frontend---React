import { api } from "./client";
import type { ExpenseGroupQuery, ExpenseGroupRequest } from "../types/expenseGroup.requests";
import type { GetExpenseGroupResponse } from "../types/expenseGroup.responses";
import { ExpenseGroupSummaryQuery } from "../types/expenses.requests";


export async function getExpenseGroups(query: ExpenseGroupQuery) {
  const res = await api.get<GetExpenseGroupResponse>("/expense-groups", {params: query});
  return res.data;
}

export async function getExpenseTotalByGroup(query: ExpenseGroupSummaryQuery) {
  const res = await api.get("expense-groups/total-by-group", {params: query});
  return res.data;
}

export async function createExpenseGroup(req: ExpenseGroupRequest) {
  const res = await api.post("/expense-groups", req);
  return res.data;
}

export async function deleteExpenseGroup(id: number) {
  const res = await api.delete(`/expense-groups/${id}`)
  return res.data;
}

export async function updateExpenseGroup(id: number, req: ExpenseGroupRequest) {
  const res = await api.put(`/expense-groups/${id}`, req);
  return res.data;
}