import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { deleteSchedTransaction } from "../../api/scheduled-transactions.api";
import { useToast } from "../../toast/ToastProvider";

export function useDeleteSchedTransaction() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    number,
    AxiosError<{ message?: string | string[] }>,
    number
  >({
    mutationFn: deleteSchedTransaction,
    onSuccess: () => {
      showToast("Scheduled transaction deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SCHEDULED],
      });
    },
    onError: () => {
      showToast(
        "There has been an error deleting the scheduled transaction",
        "error"
      );
    },
  });
}
