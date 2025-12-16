import type { Transaction } from "./transaction";

export type GetDashboardResponse = {
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  expenses: Transaction[];
  incomes: Transaction[];
}