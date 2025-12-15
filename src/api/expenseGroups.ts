import type { GetGroupResponse } from "../types/group";
import { api } from "./client";

export async function getExpenseGroups() {
  const res = await api.get<GetGroupResponse>("/expense-groups");
  return res.data;
}