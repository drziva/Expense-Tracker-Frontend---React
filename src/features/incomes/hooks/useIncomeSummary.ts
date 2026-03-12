import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIncomeSummary } from "@/features/incomes/api/incomes.api";
import type {  IncomeSummaryQuery } from "@/features/incomes/types/incomes.requests";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

export function useIncomeSummary(query: IncomeSummaryQuery) {
  return useQuery({
      queryKey: [
        QUERY_KEYS.INCOME_SUMMARY,
        query
      ],
    queryFn: () => getIncomeSummary(query),
    placeholderData: keepPreviousData
  });
}