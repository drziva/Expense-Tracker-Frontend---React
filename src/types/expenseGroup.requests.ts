export type ExpenseGroupRequest = {
  name: string;
  description: string;
  budgetCap?: number | null;
}