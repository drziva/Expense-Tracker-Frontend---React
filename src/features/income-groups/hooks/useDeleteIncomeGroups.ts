import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { deleteIncomeGroup } from "@/features/income-groups/api/income-groups.api";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useDeleteIncomeGroup() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteIncomeGroup(id),
    onSuccess: () => {
      showToast("Income group deleted successfully!");
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.DASHBOARD]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOME_GROUPS]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOMES]});
    },
    onError: () => {
      showToast("There has been an error deleting the income, please try again", "error");
    }
  })
}