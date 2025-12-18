import { z } from "zod";
import { positiveInt } from "./expense-group.schema";

export const expenseSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),

  amount: positiveInt("Amount must be a positive number"),

  groupId: positiveInt("Group ID must be a valid number")
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
