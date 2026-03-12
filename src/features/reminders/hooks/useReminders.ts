import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getReminders } from "@/features/reminders/api/reminders.api";
import type { ReminderResponse } from "@/features/reminders/types/reminders.responses";
import { AxiosError } from "axios";

export function useReminders() {
  return useQuery<ReminderResponse[]>({
    queryKey: [QUERY_KEYS.REMINDERS],
    queryFn: getReminders,    
    retry: (count, error) => {
      if(error instanceof AxiosError && error.response?.status === 403) 
        return false;
      return count<2;
    },
  })
}