import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReminderByType } from "@/features/reminders/api/reminders.api";

export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      payload,
    }: {
      type: "weekly" | "monthly";
      payload: {
        active: boolean;
        weekday?: number;
        dayOfMonth?: number;
      };
    }) => updateReminderByType(type, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}
