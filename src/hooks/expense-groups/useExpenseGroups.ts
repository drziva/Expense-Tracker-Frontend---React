import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getExpenseGroups } from "../../api/expense-groups.api.ts";
import { QUERY_KEYS } from "../../constants/queryKeys.ts";
import type { ExpenseGroupQuery } from "../../types/expenseGroup.requests.ts";

export function useExpenseGroups(query: ExpenseGroupQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_GROUPS, query],
    queryFn:() => getExpenseGroups(query),
    placeholderData: keepPreviousData
  })
}