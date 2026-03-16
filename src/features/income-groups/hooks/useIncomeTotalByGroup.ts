import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getIncomeTotalByGroup } from "@/features/income-groups/api/income-groups.api";

export function useIncomeTotalByGroup() {
    return useQuery({
        queryKey: [
          QUERY_KEYS.INCOME_TOTAL_BY_GROUP,
        ],
      queryFn: () => getIncomeTotalByGroup(),
      placeholderData: keepPreviousData
    });
  }