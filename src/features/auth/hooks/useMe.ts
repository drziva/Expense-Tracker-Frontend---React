import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMe } from "@/features/auth/api/auth";

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: getMe,
    enabled,
    retry: false,
  });
}
