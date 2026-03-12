import { z } from "zod";
import { positiveInt } from "@/features/expense-groups/schemas/expense-group.schema";

export const scheduledTransactionSchema = z
  .object({
    description: z.string().min(1, "Description must be defined"),
    amount: positiveInt("Amount must be a positive number"),
    date: z.string(),
    type: z.enum(["income", "expense"], "Transaction type must be selected"),
    incomeGroupId: z.number("Income Group must be selected").optional(),
    expenseGroupId: z.number("Expense Group must be selected").optional(),
  })
  // group validation
  .refine(
    data =>
      (data.type === "income" && !!data.incomeGroupId) ||
      (data.type === "expense" && !!data.expenseGroupId),
    {
      message: "Group is required",
      path: ["type"],
    }
  )
  // date must be provided
  .refine(
    data => data.date.trim().length > 0,
    {
      message: "Date must be selected",
      path: ["date"],
    }
  )
  // date must be in the future
  .refine(
    data => {
      const selectedDate = new Date(data.date);
      const now = new Date();
      return selectedDate > now;
    },
    {
      message: "You can only schedule transactions for future dates",
      path: ["date"],
    }
  );
