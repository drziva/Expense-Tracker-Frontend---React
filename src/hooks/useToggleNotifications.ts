import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleNotifications } from "../api/notifications.api";
import { QUERY_KEYS } from "../constants/queryKeys";

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