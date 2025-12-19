import { Chip, Stack } from "@mui/material";
import type { ExpenseGroupQuery } from "../../../types/expenseGroup.requests";

type Props = {
  query: ExpenseGroupQuery;
  onChange: (updater: (prev: ExpenseGroupQuery) => ExpenseGroupQuery) => void;
};
function capitalizeFirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function ActiveExpenseGroupsFilters({ query, onChange }: Props) {
  const hasFilters =
    query.search ||
    query.from ||
    query.to ||
    query.sort;

  if (!hasFilters) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap"}}>
      {query.search && (
        <Chip
          label={`Search: "${query.search}"`}
          onDelete={() =>
            onChange(prev => ({
              ...prev,
              search: undefined,
              page: 1,
            }))
          }
        />
      )}

      {(query.from || query.to) && (
        <Chip
          label={`Date: ${query.from ?? "Any"} → ${query.to ?? "Any"}`}
          onDelete={() =>
            onChange(prev => ({
              ...prev,
              from: undefined,
              to: undefined,
              page: 1,
            }))
          }
        />
      )}

      {query.sort && (
        <Chip
          label={`Sort: ${capitalizeFirst(query.sort.replace("_", ": "))}`}
          onDelete={() =>
            onChange(prev => ({
              ...prev,
              sort: undefined,
              page: 1,
            }))
          }
        />
      )}

      <Chip
        color="primary"
        label="Clear all"
        onDelete={() =>
          onChange(prev => ({
            page: 1,
            limit: prev.limit,
            search: ""
          }))
        }
      />
    </Stack>
  );
}
