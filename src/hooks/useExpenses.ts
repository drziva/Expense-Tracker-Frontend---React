import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/expenses";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useExpenses() {
  return useQuery({
    queryKey: QUERY_KEYS.EXPENSES,
    queryFn: getExpenses
  }); //optimistic update 
}
