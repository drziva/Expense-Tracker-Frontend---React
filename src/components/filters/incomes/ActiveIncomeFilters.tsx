import { Chip, Stack } from "@mui/material";
import formatEuros from "../../../utils/formatMoney";
import { useSearchParams } from "react-router-dom";
import { TransactionSortOption } from "../../../types/commons.types";
import { set } from "zod";
import { useIncomeGroups } from "../../../hooks/income-groups/useIncomeGroups";

function capitalizeFirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function ActiveIncomeFilters() {
  const { data } = useIncomeGroups({});

  const [searchParams, setSearchParams] = useSearchParams(); 

  const hasFilters = Boolean(
    searchParams.get("search") ||
    searchParams.get("min") ||
    searchParams.get("max") || 
    searchParams.get("from") ||
    searchParams.get("to") ||
    searchParams.get("group_id") ||
    searchParams.get("sort")
  );

  if (!hasFilters) return null;

  const search = searchParams.get("search") || undefined;
  const min = searchParams.get("min") || undefined;
  const max = searchParams.get("max") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const group = searchParams.get("group") || undefined;
  const sortParam = searchParams.get("sort") || undefined;

  const sort: TransactionSortOption | undefined = sortParam as TransactionSortOption | undefined;

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
      {search && (
        <Chip
          label={`Search: "${search}"`}
          onDelete={() => 
            setSearchParams(prev => {
              prev.delete("search");
              prev.set("page", "1");
              return prev;
          })}
        />
      )}

      {(min || max) && (
        <Chip
          label={`Amount: ${min ? formatEuros(Number(min)) : "Any"} - ${ max ? formatEuros(Number(max)) : "Any"}`}
          onDelete={() =>
            setSearchParams(prev => {
              prev.delete("min");
              prev.delete("max");
              prev.set("page", "1");
              return prev;
            })
          }
        />
      )}

      {(from || to) && (
        <Chip
          label={`Date: ${from ?? "Any"} → ${to ?? "Any"}`}
          onDelete={() =>
            setSearchParams(prev => {
              prev.delete("from");
              prev.delete("to");
              prev.set("page", "1");
              return prev;
            })
          }
        />
      )}

      {group && (
        <Chip
          label={`Group: ${data?.data?.find((g) => g.id === Number(group))?.name || group}`}
          onDelete={() =>
            setSearchParams(prev => {
              prev.delete("group_id");
              prev.set("page", "1");
              return prev;
            })
          }
        />
      )}

      {sort && (
        <Chip
          label={`Sort: ${capitalizeFirst(sort.replace("_", ": "))}`}
          onDelete={() =>
            setSearchParams(prev => {
              prev.delete("sort");
              prev.set("page", "1");
              return prev;
            })
           }
        />
      )}

      <Chip
        color="primary"
        label="Clear all"
        onDelete={() =>
          setSearchParams({})
        }
      />
    </Stack>
  );
}
