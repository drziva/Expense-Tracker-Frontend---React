import { api } from "./client";
import type { CreateExpenseGroupRequest } from "../types/expenseGroup.requests";
import type { GetExpenseGroupResponse } from "../types/expenseGroup.responses";


export async function getExpenseGroups() {
  const res = await api.get<GetExpenseGroupResponse>("/expense-groups");
  return res.data;
}

export async function createExpenseGroup(req: CreateExpenseGroupRequest) {
  const res = await api.post("/expense-groups", req);
  return res.data;
}

export async function deleteExpenseGroup(id: number) {
  const res = await api.delete(`/expense-groups/${id}`)
  return res.data;
}

