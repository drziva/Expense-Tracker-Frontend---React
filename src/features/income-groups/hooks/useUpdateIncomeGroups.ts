import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import type { AxiosError } from "axios";
import type { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses";
import type { IncomeGroupRequest } from "@/features/income-groups/types/incomeGroup.requests";
import { updateIncomeGroup } from "@/features/income-groups/api/income-groups.api";
import { useToast } from "@/app/providers/toast/ToastProvider";

export function useUpdateIncomeGroup (){
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
      IncomeGroup,
      AxiosError<{ message?: string | string[] }>,
      {
        id: number,
        req: IncomeGroupRequest
      }
    >({
    mutationFn: ({id, req}: {id: number, req: IncomeGroupRequest}) => 
      updateIncomeGroup(id, req),
    onSuccess: () => {
      showToast("Income group updated sucessfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INCOME_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INCOMES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INCOME_TOTAL_BY_GROUP] });
    },
      onError: () => {
        showToast("There has been an error updating the income group", "error");
      }
  })
}