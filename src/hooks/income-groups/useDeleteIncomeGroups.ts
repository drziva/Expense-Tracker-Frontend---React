import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { deleteIncomeGroup } from "../../api/income-groups.api";

export function useDeleteIncomeGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIncomeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]})
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOME_GROUPS]})
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOMES]})
    }
  })
}