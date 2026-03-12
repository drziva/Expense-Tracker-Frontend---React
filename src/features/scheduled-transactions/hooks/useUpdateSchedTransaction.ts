import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { updateSchedTransaction } from "@/features/scheduled-transactions/api/scheduled-transactions.api";
import type { UpdateSchedTransactionRequest } from "@/features/scheduled-transactions/api/scheduled-transactions.api";
import type { SchedTransaction } from "@/features/scheduled-transactions/types/scheduled-transactions.responses";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useUpdateSchedTransaction() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    SchedTransaction,
    AxiosError<{ message?: string | string[] }>,
    { id: number; req: UpdateSchedTransactionRequest }
  >({
    mutationFn: ({ id, req }) => updateSchedTransaction(id, req),
    onSuccess: () => {
      showToast("Scheduled transaction updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SCHEDULED],
      });
    },
    onError: () => {
      showToast(
        "There has been an error updating the scheduled transaction",
        "error"
      );
    },
  });
}
