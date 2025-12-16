import type { GetExpenseGroupResponse } from "../types/expenseGroup";
import { api } from "./client";

export async function getExpenseGroups() {
  const res = await api.get<GetExpenseGroupResponse>("/expense-groups");
  return res.data;
}