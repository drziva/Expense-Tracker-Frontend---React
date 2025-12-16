export type ExpenseGroup = {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: string;
  budgetCap?: number;
}

export type GetExpenseGroupResponse = {
  data: ExpenseGroup[];
  page:number;
  limit: number;
  totalItems: number;
  totalPages: number;
}