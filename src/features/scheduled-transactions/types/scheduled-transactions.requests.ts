export type CreateSchedTransactionRequest = {
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  incomeGroupId?: number;
  expenseGroupId?: number;
};
