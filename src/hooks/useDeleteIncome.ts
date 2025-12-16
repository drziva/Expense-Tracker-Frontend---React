import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncome } from "../api/deleteIncome";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:QUERY_KEYS.INCOMES});
      queryClient.invalidateQueries({queryKey:QUERY_KEYS.DASHBOARD});
    }
  })
}