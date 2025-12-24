import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getSchedTransactions } from "../../api/scheduled-transactions.api";
import { AxiosError } from "axios";

export function useSchedTransactions() {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHEDULED],
    queryFn: getSchedTransactions,
    retry: (count, error) => {
      if(error instanceof AxiosError && error.response?.status === 403) 
        return false;
      return count<2;
    },
  })
}