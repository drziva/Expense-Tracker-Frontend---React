import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExpenseRequest } from "../../types/expenses.requests";
import type { Expense } from "../../types/expenses.responses";
import { AxiosError } from "axios";
import { updateExpense } from "../../api/expenses.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useUpdateExpense() {
  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSES]});
          queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]});
        }
  })
}