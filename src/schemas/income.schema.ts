import { z } from "zod";
import { positiveInt } from "./expense-group.schema";

export const incomeSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),

  amount: positiveInt("Amount must be a positive number"),

  groupId: positiveInt("Income group must be selected")
});

export type ExpenseFormData = z.infer<typeof incomeSchema>;
