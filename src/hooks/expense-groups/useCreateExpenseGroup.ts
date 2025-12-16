import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpenseGroup } from "../../api/expense-groups.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { ExpenseGroup } from "../../types/expenseGroup.responses";
import type { AxiosError } from "axios";
import type { CreateExpenseGroupRequest } from "../../types/expenseGroup.requests";

export function useCreateExpenseGroup() {
  const queryClient = useQueryClient();

  return useMutation<
    ExpenseGroup,
    AxiosError<{ message?: string }>,
    CreateExpenseGroupRequest
  >({
    mutationFn: createExpenseGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.EXPENSE_GROUPS});
    }
  })
}