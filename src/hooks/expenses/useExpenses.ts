import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getExpenses } from "../../api/expenses.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { ExpenseQuery } from "../../types/expenses.requests";

export function useExpenses(query: ExpenseQuery) {
  return useQuery({
    queryKey: [ QUERY_KEYS.EXPENSES, query ],
    queryFn:() => getExpenses(query),
    placeholderData: keepPreviousData
  });
}
