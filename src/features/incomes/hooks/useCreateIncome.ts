import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { IncomeRequest } from "@/features/incomes/types/incomes.requests";
import type { Income } from "@/features/incomes/types/incomes.responses";
import { createIncome } from "@/features/incomes/api/incomes.api";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useCreateIncome() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    Income,
    AxiosError<{ message?: string | string[] }>,
    IncomeRequest
  >({
    mutationFn: createIncome,
    onSuccess: () => {
      showToast("Income added successfuly!");
      queryClient.invalidateQueries({queryKey:[QUERY_KEYS.INCOMES]})
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]})
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.INCOME_SUMMARY],
        exact: false
      });
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOME_TOTAL_BY_GROUP]})
    },
    onError: () => {
      showToast("There has been an error adding the income, please try again", "error");
    }
  });
}