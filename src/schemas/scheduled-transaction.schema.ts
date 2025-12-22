import { z } from "zod";

export const scheduledTransactionSchema = z.object({
  description: z.string().min(1, "Description must be defined"),
  amount: z.number().positive("Amount must be a positive number"),
  date: z.string(), // ISO string from date picker
  type: z.enum(["income", "expense"]),
  incomeGroupId: z.number("Income Group must be selected").optional(),
  expenseGroupId: z.number("Expense Group must be selected").optional(),
}).refine(
  data =>
    (data.type === "income" && !!data.incomeGroupId) ||
    (data.type === "expense" && !!data.expenseGroupId),
  {
    message: "Group is required",
    path: ["type"],
  }
);
