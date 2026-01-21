import { Chip, Stack } from "@mui/material";
import type { IncomeGroupQuery } from "../../../types/incomeGroup.requests";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

type Props = {
  onChange: (updater: (prev: IncomeGroupQuery) => IncomeGroupQuery) => void;
};
function capitalizeFirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function ActiveIncomeGroupsFilters({ onChange }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasFilters = Boolean(
    searchParams.get("from") ||
    searchParams.get("to") ||
    searchParams.get("sort") || 
    searchParams.get("search")
  )

  const fromParam = searchParams.get("from");
  const fromDate = 
   fromParam && dayjs(fromParam,"YYYY-MM-DD",true).isValid()
   ? fromParam
   : null;

  const toParam = searchParams.get("to");
  const toDate = 
   toParam && dayjs(toParam,"YYYY-MM-DD",true).isValid()
   ? toParam
   : null;

  const sort = searchParams.get("sort");
  const search = searchParams.get("search");

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
      {
        search && (
          <Chip
            label={`Search: "${search}"`}
            onDelete={() =>{
              setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.delete("search");
                return params;
              })
              onChange(prev => ({
               ...prev,
               search: undefined,
               page: 1,
              }))
            }
           }
         />
        )
      }

      {(fromDate || toDate) && (
        <Chip
          label={`Date: ${fromDate ?? "Any"} → ${toDate ?? "Any"}`}
          onDelete={() => {
              setSearchParams(prev => { 
                const params = new URLSearchParams(prev);
                params.delete("from");
                params.delete("to"); 
                
                return params;
              })
              onChange(prev => ({
                ...prev,
                from: undefined,
                to: undefined,
                page: 1,
              }))
            }
          }
        />
      )}

      {sort && (
        <Chip
          label={`Sort: ${capitalizeFirst(sort.replace("_", ": "))}`}
          onDelete={() => {
              setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.delete("sort");

                return params;
              })
              onChange(prev => ({
                ...prev,
                sort: undefined,
                page: 1,
                
              }))
            }
          }
        />
      )}

      <Chip
        color="primary"
        label="Clear all"
        onDelete={() => {
            setSearchParams({});
            onChange(prev => ({
              page: 1,
              limit: prev.limit,
              search: "",
            }))
          }
        }
      />
    </Stack>
  );
}
