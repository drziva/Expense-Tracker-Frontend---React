import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { ExpenseSummaryQuery } from "@/features/expenses/types/expenses.requests";
import { ExpenseSummary } from "@/features/expenses/types/expenses.responses";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getExpenseSummary } from "@/features/expenses/api/expenses.api";

export function useExpenseSummary(query: ExpenseSummaryQuery) {
    return useQuery({
        queryKey: [QUERY_KEYS.EXPENSE_SUMMARY, query],
        queryFn: () => getExpenseSummary(query),
        placeholderData: keepPreviousData
    })
}
