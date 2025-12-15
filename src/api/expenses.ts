import type { GetTransactionResponse } from "../types/transaction";
import { api } from "./client";

export async function getExpenses(): Promise<GetTransactionResponse> {
  const res = await api.get<GetTransactionResponse>("/expenses");
  return res.data;
}