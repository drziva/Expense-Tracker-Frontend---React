import { api } from "./client";
import type { IncomeGroupQuery, IncomeGroupRequest } from "../types/incomeGroup.requests";
import type { GetIncomeGroupResponse } from "../types/incomeGroup.responses";

export async function getIncomeGroups(query: IncomeGroupQuery) {
  const res = await api.get<GetIncomeGroupResponse>("/income-groups", {params: query});
  return res.data;
}

export async function createIncomeGroup(req: IncomeGroupRequest) {
  const res = await api.post("/income-groups", req);
  return res.data;
}

export async function deleteIncomeGroup(id: number) {
  const res = await api.delete(`/income-groups/${id}`)
  return res.data;
}

export async function updateIncomeGroup(id: number, req: IncomeGroupRequest) {
  const res = await api.put(`/income-groups/${id}`, req);
  return res.data;
}