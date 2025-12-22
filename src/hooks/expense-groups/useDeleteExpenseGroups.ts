import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpenseGroup } from "../../api/expense-groups.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useToast } from "../../toast/ToastProvider";

export function useDeleteExpenseGroup() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteExpenseGroup(id),
    onSuccess: () => {
      showToast("Expense group deleted sucessfully!");
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]})
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSES]})
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSE_GROUPS]})
    },
    onError: () => {
      showToast("There has been an error deleting the expense group, please try again", "error");
    }
  })
}