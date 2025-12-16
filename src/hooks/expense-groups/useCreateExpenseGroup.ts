import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpenseGroup } from "../api/expense-groups.api";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useCreateExpenseGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.EXPENSE_GROUPS});
    }
  })
}