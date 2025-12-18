import { useQuery } from "@tanstack/react-query";
import { getIncomes } from "../../api/incomes.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { IncomeQuery } from "../../types/incomeGroup.requests";

export function useIncomes(query: IncomeQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.INCOMES, query],
    queryFn: () => getIncomes(query)
  });
}