import type { Expense } from "./expenses.requests"

export type GetExpenseResponse = {
  data: Expense[],
  page: number,
  limit: number,
  totalItems: number,
  totalPages: number
}
