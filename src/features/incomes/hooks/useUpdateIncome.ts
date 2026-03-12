import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { IncomeRequest } from "@/features/incomes/types/incomes.requests";
import type { Income} from "@/features/incomes/types/incomes.responses";
import { updateIncome } from "@/features/incomes/api/incomes.api";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  const {showToast} = useToast();

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
        showToast("Income updated succesfully!");
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOMES]});
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]});
        queryClient.invalidateQueries({queryKey:[QUERY_KEYS.INCOME_SUMMARY]});
      },
      onError: () => {
        showToast("There has been an error updating the income", "error");
      }
        
  })
}