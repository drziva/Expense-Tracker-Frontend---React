import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getExpenseTotalByGroup } from "../../api/expense-groups.api";
import { ExpenseGroupSummaryQuery } from "../../types/expenses.requests";

export function useExpenseTotalByGroup(query: ExpenseGroupSummaryQuery) {
    return useQuery({
        queryKey: [QUERY_KEYS.EXPENSE_TOTAL_BY_GROUP, query],
        queryFn: () => getExpenseTotalByGroup(query),
        placeholderData: keepPreviousData
    })
}