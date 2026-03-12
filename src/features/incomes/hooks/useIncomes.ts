import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIncomes } from "@/features/incomes/api/incomes.api";
import type { IncomeQuery } from "@/features/incomes/types/incomes.requests";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
export function useIncomes(query: IncomeQuery) {
  return useQuery({
      queryKey: [
        QUERY_KEYS.INCOMES,
        query
      ],
    queryFn: () => getIncomes(query),
    placeholderData: keepPreviousData
  });
}