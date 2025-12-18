import type { Income } from "./incomes.requests"

export type GetIncomeResponse = {
  data: Income[],
  page: number,
  limit: number,
  totalItems: number,
  totalPages: number
}
