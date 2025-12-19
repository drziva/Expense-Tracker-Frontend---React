import type { IncomeQuery } from "../types/incomeGroup.requests";
import { QUERY_KEYS } from "./queryKeys";

export const incomesKey = (query: IncomeQuery) => [
  ...QUERY_KEYS.INCOMES,
  query.page ?? 1,
  query.limit ?? 10,
  query.search ?? "",
  query.sort ?? "",
  query.group_id ?? "",
  query.from ?? "",
  query.to ?? "",
];
