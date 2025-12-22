import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Props = {
  value: number;
  onChange: (val: number) => void
}

export function RowLimitSelect({onChange, value}: Props) {
  return(
  <FormControl size="small">
    <InputLabel id="rows-label">Rows</InputLabel>
    <Select
      labelId="rows-label"
      label="Rows"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <MenuItem key={5} value={5}>5</MenuItem>
      <MenuItem key={10} value={10}>10</MenuItem>
      <MenuItem key={20} value={20}>20</MenuItem>
      <MenuItem key={50} value={50}>50</MenuItem>
    </Select>
  </FormControl>
  )
}
