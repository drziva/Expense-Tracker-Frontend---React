import { useQuery } from "@tanstack/react-query";
import { getExpenseGroups } from "../api/expenseGroups";

export function useExpenseGroups() {
  return useQuery({
    queryKey:["expenseGroups"],
    queryFn: getExpenseGroups
  });
}