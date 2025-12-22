import { Chip, Stack } from "@mui/material";
import type { IncomeQuery } from "../../../types/incomeGroup.requests";
import formatEuros from "../../../utils/formatMoney";
type Props = {
  query: IncomeQuery;
  onChange: (updater: (prev: IncomeQuery) => IncomeQuery) => void;
  groups: Record<number, string>
};
function capitalizeFirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function ActiveIncomeFilters({ query, onChange, groups }: Props) {
  const hasFilters =
    query.search ||
    query.min ||
    query.max ||
    query.from ||
    query.to ||
    query.group_id ||
    query.sort;

  if (!hasFilters) return null;

  return (
    <Stack  
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{ 
        mb: 2,
        flexWrap: "wrap",
        "& .MuiChip-root": {
          width: { xs: "100%", sm: "auto" },
          justifyContent: "space-between",
        },
      }}
    >
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

      {(query.min || query.max) && (
        <Chip
          label={`Amount: ${query.min ? formatEuros(Number(query.min)) : "Any"} - ${ query.max ? formatEuros(Number(query.max)) : "Any"}`}
          onDelete={() =>
            onChange(prev => ({
              ...prev,
              min: undefined,
              max: undefined,
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

      {query.group_id && (
        <Chip
          label={`Group: ${groups[query.group_id]}`}
          onDelete={() =>
            onChange(prev => ({
              ...prev,
              group_id: undefined,
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
