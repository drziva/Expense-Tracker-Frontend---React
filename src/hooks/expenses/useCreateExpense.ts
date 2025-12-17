import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createExpense } from "../../api/expenses.api";
import type { Expense, ExpenseRequest } from "../../types/expenses.requests";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation<
    Expense,
    AxiosError<{ message?: string | string[] }>,
    ExpenseRequest
  >({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:QUERY_KEYS.EXPENSES})
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.DASHBOARD})
    }
  });
}