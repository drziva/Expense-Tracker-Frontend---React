export type ReminderType = "weekly" | "monthly";

export type ReminderResponse = {
  id: number;
  type: ReminderType;
  active: boolean;

  weekday?: number | null;
  dayOfMonth?: number | null;

  createdAt: string;
};
