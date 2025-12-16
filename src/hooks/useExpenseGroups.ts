import { useQuery } from "@tanstack/react-query";
import { getExpenseGroups } from "../api/expenseGroups";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useExpenseGroups() {
  return useQuery({
    queryKey: QUERY_KEYS.EXPENSE_GROUPS,
    queryFn: getExpenseGroups
  })
}