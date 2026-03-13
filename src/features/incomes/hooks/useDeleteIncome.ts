import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncome } from "@/features/incomes/api/incomes.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteIncome(id),
    onSuccess: () => {
      showToast("Income deleted succesfully");
      queryClient.invalidateQueries({queryKey:[QUERY_KEYS.INCOMES]});
      queryClient.invalidateQueries({queryKey:[QUERY_KEYS.DASHBOARD]});
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.INCOME_SUMMARY],
        exact: false
      });
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOME_TOTAL_BY_GROUP]})
    },
    onError: () => {
      showToast("There has been an error deleting the income", "error");
    }
  })
}