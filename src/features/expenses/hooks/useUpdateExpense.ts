import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExpenseRequest } from "@/features/expenses/types/expenses.requests";
import type { Expense } from "@/features/expenses/types/expenses.responses";
import { AxiosError } from "axios";
import { updateExpense } from "@/features/expenses/api/expenses.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    Expense,
    AxiosError<{message?: string | string[]}>,
    {
      id: number,
      req: ExpenseRequest
    }
    >({
      mutationFn: ({id, req}: {id: number, req: ExpenseRequest}) => 
        updateExpense(id, req),
      onSuccess: () => {
        showToast("Expense updated sucessfully!");
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSES]});
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]});
        queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXPENSE_SUMMARY],
        exact: false
      });
      },
    onError: () => {
      showToast("There has been an error updating the expense, please try again", "error");
    }
  })
}