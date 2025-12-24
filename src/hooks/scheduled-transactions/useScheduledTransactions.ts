import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getScheduledTransactions } from "../../api/scheduled-transactions.api";

export function useScheduledTransactions() {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHEDULED],
    queryFn: getScheduledTransactions
  })
}