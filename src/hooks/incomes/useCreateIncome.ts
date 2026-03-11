import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { IncomeRequest } from "../../types/incomes.requests";
import type { Income } from "../../types/incomes.responses";
import { createIncome } from "../../api/incomes.api";
import { useToast } from "../../toast/ToastProvider";

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
    },
    onError: () => {
      showToast("There has been an error adding the income, please try again", "error");
    }
  });
}