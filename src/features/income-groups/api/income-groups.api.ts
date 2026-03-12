import { api } from "@/shared/api/client";
import type { IncomeGroupQuery, IncomeGroupRequest, IncomeGroupSummaryQuery } from "@/features/income-groups/types/incomeGroup.requests";
import type { GetIncomeGroupResponse } from "@/features/income-groups/types/incomeGroup.responses";

export async function getIncomeGroups(query: IncomeGroupQuery) {
  const res = await api.get<GetIncomeGroupResponse>("/income-groups", {params: query});
  return res.data;
}

export async function getIncomeTotalByGroup(query: IncomeGroupSummaryQuery) {
  const res = await api.get("/income-groups/total-by-group", {params: query});
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