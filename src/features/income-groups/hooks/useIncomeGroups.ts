import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getIncomeGroups } from "@/features/income-groups/api/income-groups.api";
import type { IncomeGroupQuery } from "@/features/income-groups/types/incomeGroup.requests";

export function useIncomeGroups(query: IncomeGroupQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.INCOME_GROUPS, query],
    queryFn: () => getIncomeGroups(query),
    placeholderData: keepPreviousData
  })
}
