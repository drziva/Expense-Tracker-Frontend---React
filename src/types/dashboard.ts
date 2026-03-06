import type { Expense } from "./expenses.responses";
import type { Income } from "./incomes.responses";

export type GetDashboardResponse = {
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  expenses: Expense[];
  incomes: Income[];
}

export type DashboardSummaryQuery = {
  from?: string;
  to?: string;
}

export type DashboardSummary = {
  date: string;
  expense: number;
  income: number;
}