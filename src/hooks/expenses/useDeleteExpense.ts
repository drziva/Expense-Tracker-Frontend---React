import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../../api/expenses.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSES]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]});
    }
  })
}