import type { GetScheduledTransactionsResponse } from "../types/scheduledTransactions.responses";
import { api } from "./client";

export async function getScheduledTransactions() {
  const res = await api.get<GetScheduledTransactionsResponse>("/scheduled-transactions");
  return res.data;
}