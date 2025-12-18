export type IncomeGroup = {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: string;
}

export type GetIncomeGroupResponse = {
  data: IncomeGroup[];
  page:number;
  limit: number;
  totalItems: number;
  totalPages: number;
}