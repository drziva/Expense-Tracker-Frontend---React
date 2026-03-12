import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleNotifications } from "@/features/auth/api/notifications.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

export function useToggleNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ME]
      })
    },
  })
}