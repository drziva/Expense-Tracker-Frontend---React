import type { GetTransactionResponse } from "../types/transaction";
import { api } from "./client";


export async function getIncomes() {
  const res = await api.get<GetTransactionResponse>("/incomes");
  return res.data;
}

export async function deleteIncome(id: number) {
  const res = await api.delete(`/incomes/${id}`);
  return res.data;
}