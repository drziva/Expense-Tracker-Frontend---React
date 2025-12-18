import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { AxiosError } from "axios";
import type { IncomeGroupRequest } from "../../types/incomeGroup.requests";
import type { IncomeGroup } from "../../types/incomeGroup.responses";
import { createIncomeGroup } from "../../api/income-groups.api";

export function useCreateIncomeGroup() {
  const queryClient = useQueryClient();

  return useMutation<
    IncomeGroup,
    AxiosError<{ message?: string | string[] }>,
    IncomeGroupRequest
  >({
    mutationFn: createIncomeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.INCOME_GROUPS});
    }
  })
}