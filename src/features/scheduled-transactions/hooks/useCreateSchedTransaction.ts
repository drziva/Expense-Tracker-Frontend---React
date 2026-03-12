import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { createSchedTransaction } from "@/features/scheduled-transactions/api/scheduled-transactions.api";
import type { CreateSchedTransactionRequest } from "@/features/scheduled-transactions/types/scheduled-transactions.requests";
import type { SchedTransaction } from "@/features/scheduled-transactions/types/scheduled-transactions.responses";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useCreateSchedTransaction() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    SchedTransaction,
    AxiosError<{ message?: string | string[] }>,
    CreateSchedTransactionRequest
  >({
    mutationFn: createSchedTransaction,
    onSuccess: () => {
      showToast("Scheduled transaction created successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SCHEDULED],
      });
    },
    onError: () => {
      showToast(
        "There has been an error creating the scheduled transaction",
        "error"
      );
    },
  });
}
