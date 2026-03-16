import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getExpenseTotalByGroup } from "@/features/expense-groups/api/expense-groups.api";

export function useExpenseTotalByGroup() {
    return useQuery({
        queryKey: [QUERY_KEYS.EXPENSE_TOTAL_BY_GROUP],
        queryFn: () => getExpenseTotalByGroup(),
        placeholderData: keepPreviousData
    })
}