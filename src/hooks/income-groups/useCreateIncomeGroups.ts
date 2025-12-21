import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { AxiosError } from "axios";
import type { IncomeGroupRequest } from "../../types/incomeGroup.requests";
import type { IncomeGroup } from "../../types/incomeGroup.responses";
import { createIncomeGroup } from "../../api/income-groups.api";
import { useToast } from "../../toast/ToastProvider";

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