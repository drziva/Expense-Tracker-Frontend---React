import { api } from "@/shared/api/client";

export async function toggleNotifications() {
  const res = await api.put("/users/notifications/toggle");
  return res.data;
}