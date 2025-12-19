import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIncomes } from "../../api/incomes.api";
import type { IncomeQuery } from "../../types/incomeGroup.requests";
import { incomesKey } from "../../constants/income.keys";

export function useIncomes(query: IncomeQuery) {
  return useQuery({
    queryKey: incomesKey(query),
    queryFn: () => getIncomes(query),
    placeholderData: keepPreviousData
  });
}