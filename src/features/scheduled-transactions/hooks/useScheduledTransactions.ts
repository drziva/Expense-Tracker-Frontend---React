import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getSchedTransactions } from "@/features/scheduled-transactions/api/scheduled-transactions.api";

export function useScheduledTransactions() {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHEDULED],
    queryFn: getSchedTransactions
  })
}
