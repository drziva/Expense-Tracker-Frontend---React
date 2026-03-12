export type SchedTransaction = {
  id:number;
  userId: number;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  incomeGroupId?: number;
  expenseGroupId?: number;
  expenseGroupName?: string;
  incomeGroupName?: string;
}

export type GetSchedTransactionResponse = SchedTransaction[];