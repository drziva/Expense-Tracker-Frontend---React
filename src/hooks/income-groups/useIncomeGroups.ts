import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { getIncomeGroups } from "../../api/income-groups.api.js";
import type { IncomeGroupQuery } from "../../types/incomeGroup.requests.ts";

export function useIncomeGroups(query: IncomeGroupQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.INCOME_GROUPS, query],
    queryFn: () => getIncomeGroups(query),
    placeholderData: keepPreviousData
  })
}