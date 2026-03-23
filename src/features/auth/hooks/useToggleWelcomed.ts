import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWelcomed } from "../api/welcomed.api";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

export function useToggleWelcomed() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleWelcomed,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ME]});
        }
    })
}