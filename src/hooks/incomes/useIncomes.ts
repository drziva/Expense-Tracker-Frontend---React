import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIncomes } from "../../api/incomes.api";
import type { IncomeQuery } from "../../types/incomeGroup.requests";
export function useIncomes(query: IncomeQuery) {
  return useQuery({
      queryKey: [
        "incomes",
        query.page,
        query.limit,
        query.min,
        query.max,
        query.from,
        query.to,
        query.group_id,
        query.sort,
      ],
    queryFn: () => getIncomes(query),
    placeholderData: keepPreviousData
  });
}