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
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { SortOption } from "../../../types/pagination";
import { useIncomeGroups } from "../../../hooks/income-groups/useIncomeGroups";
import type { IncomeQuery } from "../../../types/incomeGroup.requests";

export type IncomeFilterValues = {
  from?: string;
  to?: string;
  min?: number;
  max?: number;
  group_id?: number;
  sort?: SortOption;
};

type Props = {
  open: boolean;
  query: IncomeQuery;
  onClose: () => void;
  onApply: (values: IncomeFilterValues) => void;
};

export function IncomesFiltersDialog({ open, onClose, onApply, query }: Props) {
  const { data } = useIncomeGroups({});
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [sort, setSort] = useState<SortOption | "">("");
  const [groupId, setGroupId] = useState<number | "">("");

  useEffect(() => {
    setMinValue(query.min?.toString() ?? "");
    setMaxValue(query.max?.toString() ?? "");
    setFromDate(query.from ? dayjs(query.from) : null);
    setToDate(query.to ? dayjs(query.to) : null);
    setGroupId(query.group_id ?? "");
    setSort(query.sort ?? "");
  }, [query]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter incomes</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          id="income-filters-form"
          onSubmit={(e) => {
            e.preventDefault();

            const min = minValue !== "" ? Number(minValue) : undefined;
            const max = maxValue !== "" ? Number(maxValue) : undefined;
            const group = groupId !== "" ? Number(groupId) : undefined;

            onApply({
              from: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
              to: toDate ? toDate.format("YYYY-MM-DD") : undefined,
              min,
              max,
              sort: sort || undefined,
              group_id: group,
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
              Amount
            </Typography>

            <TextField
              size="small"
              label="Min"
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              fullWidth
              sx={{
                mb:2
              }}
            />
            <TextField
              size="small"
              label="Max"
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              fullWidth
            />
          </Box>

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
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Group
            </Typography>
            <FormControl size="small" fullWidth>
              <InputLabel id="group-label">Group</InputLabel>
              <Select
                labelId="group-label"
                label="Group"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value as number | "")}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {data?.data?.map((gr) => (
                  <MenuItem key={gr.id} value={gr.id}>
                    {gr.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button form="income-filters-form" type="submit" variant="contained">
          Apply
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
