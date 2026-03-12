import type { ReminderResponse } from "@/features/reminders/types/reminders.responses";
import { api } from "@/shared/api/client";

type UpdateReminderPayload = {
  active: boolean;
  weekday?: number;
  dayOfMonth?: number;
};

export async function getReminders() {
  const res = await api.get("/reminders");
  return res.data;
}

export async function updateReminderByType(
  type: "weekly" | "monthly",
  payload: UpdateReminderPayload
): Promise<ReminderResponse> {
  const { data } = await api.put(`/reminders/${type}`, payload);
  return data;
}
