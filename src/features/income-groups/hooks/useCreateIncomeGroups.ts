import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { AxiosError } from "axios";
import type { IncomeGroupRequest } from "@/features/income-groups/types/incomeGroup.requests";
import type { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses";
import { createIncomeGroup } from "@/features/income-groups/api/income-groups.api";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useCreateIncomeGroup() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  

  return useMutation<
    IncomeGroup,
    AxiosError<{ message?: string | string[] }>,
    IncomeGroupRequest
  >({
    mutationFn: createIncomeGroup,
    onSuccess: () => {
      showToast("Income group created successfully!");
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.INCOME_GROUPS]});
    },
    onError: () => {
      showToast("There has been an error creating the income, please try again", "error");
    }
  })
}