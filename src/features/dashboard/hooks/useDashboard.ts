import { useQuery } from "@tanstack/react-query";
import { getDashboard, getDashboardSummary } from "@/features/dashboard/api/dashboard";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { DashboardSummaryQuery } from "@/features/dashboard/types/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: getDashboard
  })
}

export function useDashboardSummary(query: DashboardSummaryQuery) {
  return useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD_SUMMARY, query
    ],
    queryFn: () => getDashboardSummary(query)
  })
}