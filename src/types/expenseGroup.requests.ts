export type CreateExpenseGroupRequest = {
  name: string;
  description: string;
  budgetCap?: number | null;
}