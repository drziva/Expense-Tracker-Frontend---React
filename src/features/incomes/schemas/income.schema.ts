import { z } from "zod";
import { positiveInt } from "@/features/expense-groups/schemas/expense-group.schema";

export const incomeSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),

  amount: z.coerce.number().positive("Amount must be a positive number"),

  groupId: positiveInt("Income group must be selected")
});

export type IncomeFormData = z.infer<typeof incomeSchema>;
