import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncome } from "../api/deleteIncome";

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["incomes"]});
      queryClient.invalidateQueries({ queryKey:["dashboard"]});
    }
  })
}