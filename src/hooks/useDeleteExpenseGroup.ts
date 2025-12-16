import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpenseGroup } from "../api/deleteExpenseGroup";

export function useDeleteExpenseGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExpenseGroup(id),
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["expense-groups"]});
      queryClient.invalidateQueries({queryKey: ["expenses"]});
      queryClient.invalidateQueries({queryKey: ["dashboard"]});
    }
  })
}