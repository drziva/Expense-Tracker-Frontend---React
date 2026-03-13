import { FormControl, MenuItem, Select } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export function RowLimitSelect() {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit") ?? "10";

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 70
      }}
    >
      <Select
        value={limit}
        displayEmpty
        onChange={(e) => {
          setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("limit", String(e.target.value));
            params.set("page", "1");
            return params;
          });
        }}
      >
        <MenuItem value="5">5</MenuItem>
        <MenuItem value="10">10</MenuItem>
        <MenuItem value="20">20</MenuItem>
        <MenuItem value="50">50</MenuItem>
      </Select>
    </FormControl>
  );
}