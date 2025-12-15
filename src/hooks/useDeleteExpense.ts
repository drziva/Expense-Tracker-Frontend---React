import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../api/deleteExpense";

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["expenses"] })
    }
  })
}