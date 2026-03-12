import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export function RowLimitSelect() {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit") ?? 10;

  return(
  <FormControl size="small">
    <InputLabel id="rows-label">Rows</InputLabel>
    <Select
      labelId="rows-label"
      label="Rows"
      value={limit}
      onChange={(e) => {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          params.set("limit", String(e.target.value));
          params.set("page", "1");
          return params;
        })
      }}
    >
      <MenuItem key={5} value={5}>5</MenuItem>
      <MenuItem key={10} value={10}>10</MenuItem>
      <MenuItem key={20} value={20}>20</MenuItem>
      <MenuItem key={50} value={50}>50</MenuItem>
    </Select>
  </FormControl>
  )
}
