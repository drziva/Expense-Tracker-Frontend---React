import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createExpense } from "@/features/expenses/api/expenses.api";
import type { ExpenseRequest } from "@/features/expenses/types/expenses.requests";
import type { Expense } from "@/features/expenses/types/expenses.responses";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useToast } from "@/app/providers/toast/ToastProvider";

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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXPENSE_SUMMARY],
        exact: false
      });
    },
    onError: () => {
      showToast("There has been an error creating the expense, please try again", "error");
    }
  });
}