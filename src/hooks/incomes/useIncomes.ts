import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIncomes } from "../../api/incomes.api";
import type { IncomeQuery } from "../../types/incomeGroup.requests";
import { QUERY_KEYS } from "../../constants/queryKeys";
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