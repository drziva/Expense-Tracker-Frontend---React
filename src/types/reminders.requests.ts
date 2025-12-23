export type ReminderQuery = {
  type: "weekly" | "monthly";
  active: boolean;
}