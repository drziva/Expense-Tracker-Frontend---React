import type { GetTransactionResponse } from "../types/transaction";
import { api } from "./client";

export async function getExpenses() {
  const res = await api.get<GetTransactionResponse>("/expenses");
  return res.data;
}