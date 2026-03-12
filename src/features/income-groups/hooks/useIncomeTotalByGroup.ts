import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getIncomeTotalByGroup } from "@/features/income-groups/api/income-groups.api";
import { IncomeGroupSummaryQuery } from "@/features/income-groups/types/incomeGroup.requests";

export function useIncomeTotalByGroup(query: IncomeGroupSummaryQuery) {
    return useQuery({
        queryKey: [
          QUERY_KEYS.INCOME_TOTAL_BY_GROUP,
          query
        ],
      queryFn: () => getIncomeTotalByGroup(query),
      placeholderData: keepPreviousData
    });
  }