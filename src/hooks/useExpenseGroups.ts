import { useQuery } from "@tanstack/react-query";
import { getExpenseGroups } from "../api/expenseGroups";

export function useExpenseGroups() {
  return useQuery({
    queryKey: ["expense-groups"],
    queryFn: getExpenseGroups
  })
}