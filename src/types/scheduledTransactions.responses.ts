export type ScheduledTransaction = {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  incomeGroupId?: number;
  expenseGroupId?: number;
}

export type GetScheduledTransactionsResponse =  ScheduledTransaction[];