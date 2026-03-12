import { z } from "zod";
import { positiveInt } from "@/features/expense-groups/schemas/expense-group.schema";

export const expenseSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),

  amount: positiveInt("Amount must be a positive number"),

  groupId: positiveInt("Expense group must be selected")
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
