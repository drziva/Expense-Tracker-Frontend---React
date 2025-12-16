import { api } from "./client";

export async function deleteExpenseGroup(id: number) {
  const res = await api.delete(`/expense-groups/${id}`)
  return res.data;
}