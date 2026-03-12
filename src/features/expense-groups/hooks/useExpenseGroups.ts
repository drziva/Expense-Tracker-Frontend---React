import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getExpenseGroups } from "@/features/expense-groups/api/expense-groups.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { ExpenseGroupQuery } from "@/features/expense-groups/types/expenseGroup.requests";

export function useExpenseGroups(query: ExpenseGroupQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_GROUPS, query],
    queryFn:() => getExpenseGroups(query),
    placeholderData: keepPreviousData
  })
}