import type { Expense } from "./expenses.responses";
import type { Income } from "./incomes.responses";

export type GetDashboardResponse = {
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  expenses: Expense[];
  incomes: Income[];
}