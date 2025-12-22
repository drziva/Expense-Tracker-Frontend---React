import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncome } from "../../api/incomes.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useToast } from "../../toast/ToastProvider";

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteIncome(id),
    onSuccess: () => {
      showToast("Income deleted succesfully");
      queryClient.invalidateQueries({queryKey:[QUERY_KEYS.INCOMES]});
      queryClient.invalidateQueries({queryKey:[QUERY_KEYS.DASHBOARD]});
    },
    onError: () => {
      showToast("There has been an error deleting the income", "error");
    }
  })
}