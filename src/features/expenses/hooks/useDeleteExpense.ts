import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "@/features/expenses/api/expenses.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      showToast("Expense deleted sucessfully!");
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSES]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]});
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXPENSE_SUMMARY],
        exact: false
      });
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSE_TOTAL_BY_GROUP]})
    },
    onError: () => {
      showToast("There has been an error deleting the expense, please try again", "error");
    }
  })
}