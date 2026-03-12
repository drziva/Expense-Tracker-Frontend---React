import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SortIcon from "@mui/icons-material/Sort";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { GroupSortOption } from "@/shared/types/pagination";
import { useSearchParams } from "react-router-dom";

export type ExpenseGroupFilterValues = {
  from?: string;
  to?: string;
  sort?: GroupSortOption;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ExpenseGroupsFiltersDialog({ open, onClose }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [draftFromDate, setDraftFromDate] = useState<dayjs.Dayjs | null>(null);
  const [draftToDate, setDraftToDate] = useState<dayjs.Dayjs | null>(null);
  const [draftSort, setDraftSort] = useState<GroupSortOption | "">("");

  useEffect(() => {
    setDraftFromDate(searchParams.get("from") ? dayjs(searchParams.get("from")) : null);
    setDraftToDate(searchParams.get("to") ? dayjs(searchParams.get("to")) : null);
    setDraftSort((searchParams.get("sort") as GroupSortOption) || "");
  }, [searchParams])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FilterAltIcon />
        Filter Expense Groups
      </DialogTitle>

      <DialogContent>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3
          }}
        >

          <Stack
            spacing={3}
            component="form"
            id="expense-group-filters-form"
            onSubmit={(e) => {
              e.preventDefault();

              setSearchParams(prev => {
                const params = new URLSearchParams(prev);

                if (draftFromDate) {
                  params.set("from", draftFromDate.format("YYYY-MM-DD"));
                } else {
                  params.delete("from");
                }

                if (draftToDate) {
                  params.set("to", draftToDate.format("YYYY-MM-DD"));
                } else {
                  params.delete("to");
                }

                if (draftSort) {
                  params.set("sort", draftSort);
                } else {
                  params.delete("sort");
                }

                return params;
              });

              onClose();
            }}
          >

            {/* Date */}

            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonthIcon color="primary" fontSize="small" />
                <Typography fontWeight={600}>Date range</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={2}>
                <DatePicker
                  label="From"
                  value={draftFromDate}
                  onChange={setDraftFromDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />

                <DatePicker
                  label="To"
                  value={draftToDate}
                  onChange={setDraftToDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Stack>
            </Box>

            {/* Sorting */}

            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SortIcon fontSize="small" sx={{ color: "#7b1fa2" }} />
                <Typography fontWeight={600}>Sorting</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <FormControl size="small" fullWidth>
                <InputLabel id="sort-label">Sort by</InputLabel>

                <Select
                  labelId="sort-label"
                  label="Sort by"
                  value={draftSort}
                  onChange={(e) =>
                    setDraftSort(e.target.value as GroupSortOption | "")
                  }
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

          </Stack>

        </Paper>

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button form="expense-group-filters-form" type="submit" variant="contained">
          Apply Filters
        </Button>

        <Button onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>

    </Dialog>
  );
}