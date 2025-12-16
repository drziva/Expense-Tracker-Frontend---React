export type Transaction = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  groupId: number;
  groupName: string;
}

export type GetTransactionResponse = {
  data: Transaction[],
  page: number,
  limit: number,
  totalItems: number,
  totalPages: number
}
