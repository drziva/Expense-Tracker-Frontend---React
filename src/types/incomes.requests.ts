export type Income = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type IncomeRequest = {
  description: string;
  amount: number;
  groupId: number;
}
