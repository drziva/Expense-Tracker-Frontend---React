import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getIncomeTotalByGroup } from "../../api/income-groups.api";
import { IncomeGroupSummaryQuery } from "../../types/incomeGroup.requests";

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