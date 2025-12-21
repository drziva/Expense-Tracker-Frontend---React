import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpenseGroup } from "../../api/expense-groups.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { ExpenseGroupRequest } from "../../types/expenseGroup.requests";
import type { ExpenseGroup } from "../../types/expenseGroup.responses";
import type { AxiosError } from "axios";
import { useToast } from "../../toast/ToastProvider";

export function useUpdateExpenseGroup (){
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
      ExpenseGroup,
      AxiosError<{ message?: string | string[] }>,
      {
        id: number,
        req: ExpenseGroupRequest
      }
    >({
    mutationFn: ({id, req}: {id: number, req: ExpenseGroupRequest}) => 
      updateExpenseGroup(id, req),
    onSuccess: () => {
      showToast("Expense group updated sucessfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSE_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
    onError: () => {
      showToast("There has been an error updating the expense group, please try again", "error");
    }
  })
}