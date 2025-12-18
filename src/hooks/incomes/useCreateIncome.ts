import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { Income, IncomeRequest } from "../../types/incomes.requests";
import { createIncome } from "../../api/incomes.api";

export function useCreateIncome() {
  const queryClient = useQueryClient();
  
  return useMutation<
    Income,
    AxiosError<{ message?: string | string[] }>,
    IncomeRequest
  >({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:QUERY_KEYS.INCOMES})
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.DASHBOARD})
    }
  });
}