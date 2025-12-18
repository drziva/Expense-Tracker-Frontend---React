import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { Income, IncomeRequest } from "../../types/incomes.requests";
import { updateIncome } from "../../api/incomes.api";

export function useUpdateIncome() {
  const queryClient = useQueryClient();

  return useMutation<
    Income,
    AxiosError<{message?: string | string[]}>,
    {
      id: number,
      req: IncomeRequest
    }
    >({
        mutationFn: ({id, req}: {id: number, req: IncomeRequest}) => 
          updateIncome(id, req),
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: QUERY_KEYS.INCOMES});
          queryClient.invalidateQueries({queryKey: QUERY_KEYS.DASHBOARD});
        }
  })
}