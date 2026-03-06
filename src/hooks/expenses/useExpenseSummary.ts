import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { ExpenseSummaryQuery } from "../../types/expenses.requests";
import { ExpenseSummary } from "../../types/expenses.responses";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getExpenseSummary } from "../../api/expenses.api";

export function useExpenseSummary(query: ExpenseSummaryQuery) {
    return useQuery({
        queryKey: [QUERY_KEYS.EXPENSE_SUMMARY, query],
        queryFn: () => getExpenseSummary(query),
        placeholderData: keepPreviousData
    })
}