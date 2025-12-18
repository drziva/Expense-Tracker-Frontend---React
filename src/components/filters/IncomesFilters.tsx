import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import type dayjs from "dayjs";
import type { SortOption } from "../../types/pagination";

export type IncomeFilterValues = {
  search?: string;
  from?: string;
  to?: string;
  min?: number;
  max?: number;
  sort?: SortOption;
};

type Props = {
  onApply: (values: IncomeFilterValues) => void;
};

export function IncomesFilters({ onApply }: Props) {
  const [searchText, setSearchText] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [sort, setSort] = useState<SortOption | "">("");

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();

        const min = minValue !== "" ? Number(minValue) : undefined;
        const max = maxValue !== "" ? Number(maxValue) : undefined;

        onApply({
          search: searchText || undefined,
          from: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
          to: toDate ? toDate.add(1, "day").format("YYYY-MM-DD") : undefined,
          min,
          max,
          sort: sort || undefined,
        });
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
        p: 1.5,
        mb: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <TextField
        size="small"
        label="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ minWidth: 180 }}
      />

      <TextField
        size="small"
        label="Min"
        type="number"
        value={minValue}
        onChange={(e) => setMinValue(e.target.value)}
        sx={{ width: 100 }}
      />

      <TextField
        size="small"
        label="Max"
        type="number"
        value={maxValue}
        onChange={(e) => setMaxValue(e.target.value)}
        sx={{ width: 100 }}
      />

      <DatePicker
        label="From"
        value={fromDate}
        onChange={setFromDate}
        slotProps={{
          textField: {
            size: "small",
            sx: { width: 140 },
            InputProps: { readOnly: true },
          },
        }}
      />

      <DatePicker
        label="To"
        value={toDate}
        onChange={setToDate}
        slotProps={{
          textField: {
            size: "small",
            sx: { width: 140 },
            InputProps: { readOnly: true },
          },
        }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="sort-label">Sort</InputLabel>
        <Select
          labelId="sort-label"
          label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="date_desc">Date ↓</MenuItem>
          <MenuItem value="date_asc">Date ↑</MenuItem>
          <MenuItem value="amount_desc">Amount ↓</MenuItem>
          <MenuItem value="amount_asc">Amount ↑</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="outlined"
        sx={{
          ml: "auto",
          px: 3,
          height: 40,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        Apply
      </Button>
    </Box>
  );
}
