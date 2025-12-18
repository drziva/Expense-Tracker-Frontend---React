import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { AxiosError } from "axios";
import type { IncomeGroup } from "../../types/incomeGroup.responses";
import type { IncomeGroupRequest } from "../../types/incomeGroup.requests";
import { updateIncomeGroup } from "../../api/income-groups.api";

export function useUpdateIncomeGroup (){
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INCOME_GROUPS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INCOMES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    }
  })
}