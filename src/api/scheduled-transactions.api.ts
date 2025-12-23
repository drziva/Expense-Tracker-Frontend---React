import type { CreateSchedTransactionRequest } from "../types/scheduled-transactions.requests";
import type { SchedTransaction } from "../types/scheduled-transactions.responses";
import { api } from "./client";

export type UpdateSchedTransactionRequest = CreateSchedTransactionRequest;

export async function getSchedTransactions() {
  const { data } = await api.get<SchedTransaction[]>("/scheduled-transactions");
  return data;
}

export async function createSchedTransaction(
  req: CreateSchedTransactionRequest
) {
  const { data } = await api.post<SchedTransaction>(
    "/scheduled-transactions",
    req
  );
  return data;
}

export async function updateSchedTransaction(
  id: number,
  req: UpdateSchedTransactionRequest
) {
  const { data } = await api.put<SchedTransaction>(
    `/scheduled-transactions/${id}`,
    req
  );
  return data;
}

export async function deleteSchedTransaction(id: number) {
  await api.delete(`/scheduled-transactions/${id}`);
  return id;
}