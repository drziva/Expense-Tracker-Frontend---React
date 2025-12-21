import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createExpense } from "../../api/expenses.api";
import type { ExpenseRequest } from "../../types/expenses.requests";
import type { Expense } from "../../types/expenses.responses";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useToast } from "../../toast/ToastProvider";

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    Expense,
    AxiosError<{ message?: string | string[] }>,
    ExpenseRequest
  >({
    mutationFn: createExpense,
    onSuccess: () => {
      showToast("Expense created sucessfully!");
      queryClient.invalidateQueries({queryKey:[QUERY_KEYS.EXPENSES]})
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]})
    },
    onError: () => {
      showToast("There has been an error creating the expense, please try again", "error");
    }
  });
}