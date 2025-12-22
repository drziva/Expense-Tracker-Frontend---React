import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { GroupSortOption } from "../../../types/pagination";
import type { IncomeGroupQuery } from "../../../types/incomeGroup.requests";

export type IncomeFilterValues = {
  from?: string;
  to?: string;
  sort?: GroupSortOption;
};

type Props = {
  open: boolean;
  query: IncomeGroupQuery;
  onClose: () => void;
  onApply: (values: IncomeFilterValues) => void;
};

export function IncomeGroupsFiltersDialog({ open, onClose, onApply, query }: Props) {
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [sort, setSort] = useState<GroupSortOption | "">("");

  useEffect(() => {
    setFromDate(query.from ? dayjs(query.from) : null);
    setToDate(query.to ? dayjs(query.to) : null);
    setSort(query.sort ?? "");
  }, [query]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter income groups</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="income-group-filters-form"
          onSubmit={(e) => {
            e.preventDefault();

            onApply({
              from: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
              to: toDate ? toDate.format("YYYY-MM-DD") : undefined,
              sort: sort || undefined
            });

            onClose();
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 1,
          }}
        >

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Date range
            </Typography>

            <DatePicker
              label="From"
              value={fromDate}
              onChange={setFromDate}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              sx={{
                mb:2
              }}
            />

            <DatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sorting
            </Typography>
            <FormControl size="small" fullWidth>
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                label="Sort by"
                value={sort}
                onChange={(e) => setSort(e.target.value as GroupSortOption)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="date_desc">Date ↓</MenuItem>
                <MenuItem value="date_asc">Date ↑</MenuItem>
                <MenuItem value="name_desc">Name ↓</MenuItem>
                <MenuItem value="name_asc">Name ↑</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button form="income-group-filters-form" type="submit" variant="contained">
          Apply
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
