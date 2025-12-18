import type { Expense } from "./expenses.requests";
import type { Transaction } from "./transaction";

export type GetDashboardResponse = {
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  expenses: Expense[];
  incomes: Transaction[];
}