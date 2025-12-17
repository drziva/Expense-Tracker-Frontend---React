export type Expense = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type ExpenseRequest = {
  description: string;
  amount: number;
  groupId: number;
}
