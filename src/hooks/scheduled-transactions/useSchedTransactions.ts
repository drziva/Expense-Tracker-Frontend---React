import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getSchedTransactions } from "../../api/scheduled-transactions.api";

export function useSchedTransactions() {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHEDULED],
    queryFn: getSchedTransactions
  })
}