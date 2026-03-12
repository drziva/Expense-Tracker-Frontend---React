import type { Expense } from "@/features/expenses/types/expenses.responses";
import type { Income } from "@/features/incomes/types/incomes.responses";

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