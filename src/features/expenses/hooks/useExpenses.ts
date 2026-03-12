import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/features/expenses/api/expenses.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { ExpenseQuery } from "@/features/expenses/types/expenses.requests";

export function useExpenses(query: ExpenseQuery) {
  return useQuery({
    queryKey: [ QUERY_KEYS.EXPENSES, query ],
    queryFn:() => getExpenses(query),
    placeholderData: keepPreviousData
  });
}
