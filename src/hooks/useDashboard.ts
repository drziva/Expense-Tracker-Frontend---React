import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: getDashboard
  })
}