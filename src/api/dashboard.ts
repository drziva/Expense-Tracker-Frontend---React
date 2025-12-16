import type { GetDashboardResponse } from "../types/dashboard";
import { api } from "./client";

export async function getDashboard() {
  const res = await api.get<GetDashboardResponse>("/dashboard");
  return res.data;
}