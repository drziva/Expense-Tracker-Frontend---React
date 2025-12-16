import { useQuery } from "@tanstack/react-query";
import { getIncomes } from "../../api/incomes.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useIncomes() {
  return useQuery({
    queryKey: QUERY_KEYS.INCOMES,
    queryFn: getIncomes
  });
}