import { z } from "zod";

export const positiveInt = (message: string) =>
    z.string()
    .transform((v) => Number(v))
    .refine((n) => 
      Number.isFinite(n) && 
      Number.isInteger(n) && 
      n > 0 ,
      message
    );

export const expenseGroupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  description: z.string().trim().min(1, "Description is required"),

  budgetCap: z
    .union([
      z.literal(""),
      positiveInt("Budget Cap must be a positive number"),
    ])
    .transform((v) => (v === "" ? undefined : v)),
});

export type ExpenseGroupFormData = z.infer<typeof expenseGroupSchema>
