import { api } from "./client";

export async function deleteExpense(id: number) {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
}