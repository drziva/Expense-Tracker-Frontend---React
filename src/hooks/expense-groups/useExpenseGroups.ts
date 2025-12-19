import { useQuery } from "@tanstack/react-query";
import { getExpenseGroups } from "../../api/expense-groups.api.ts";
import { QUERY_KEYS } from "../../constants/queryKeys.ts";

export function useExpenseGroups() {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_GROUPS],
    queryFn: getExpenseGroups
  })
}