import type { DashboardSummary, DashboardSummaryQuery, GetDashboardResponse } from "../types/dashboard";
import { api } from "./client";

export async function getDashboard() {
  const res = await api.get<GetDashboardResponse>("/dashboard");
  return res.data;
}

export async function getDashboardSummary(query: DashboardSummaryQuery) {
  const res = await api.get<DashboardSummary[]>("/dashboard/summary", { params: query });
  return res.data;
}