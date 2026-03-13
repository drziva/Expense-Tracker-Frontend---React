export type Group = {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: string;
}

export type GetGroupResponse = {
  data: Group[];
  page:number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export type GroupSummary = {
  groupName: string;
  total: number;
}