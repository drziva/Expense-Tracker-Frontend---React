import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpenseGroup } from "@/features/expense-groups/api/expense-groups.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { ExpenseGroup } from "@/features/expense-groups/types/expenseGroup.responses";
import type { AxiosError } from "axios";
import type { ExpenseGroupRequest } from "@/features/expense-groups/types/expenseGroup.requests";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useCreateExpenseGroup() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ExpenseGroup,
    AxiosError<{ message?: string | string[] }>,
    ExpenseGroupRequest
  >({
    mutationFn: createExpenseGroup,
    onSuccess: () => {
      showToast("Expense group created sucessfully!");
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSE_GROUPS]});
    },
    onError: () => {
      showToast("There has been an error creating the expense group, please try again", "error");
    }
  })
}