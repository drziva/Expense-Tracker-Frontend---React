import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpenseGroup } from "../api/deleteExpenseGroup";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useDeleteExpenseGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExpenseGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.DASHBOARD})
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.EXPENSES})
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.INCOMES})
    }
  })
}