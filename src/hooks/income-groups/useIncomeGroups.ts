import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys.ts";
import { getIncomeGroups } from "../../api/income-groups.api.ts";

export function useIncomeGroups() {
  return useQuery({
    queryKey: [QUERY_KEYS.INCOME_GROUPS],
    queryFn: getIncomeGroups
  })
}