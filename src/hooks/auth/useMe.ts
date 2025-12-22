import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getMe } from "../../api/auth";

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: getMe,
    enabled,
    retry: false,
  });
}
