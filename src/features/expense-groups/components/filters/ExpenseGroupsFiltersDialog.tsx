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
import { useState } from "react";
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

export function ExpenseGroupsFiltersDialog({ open, onClose}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftFromDate, setDraftFromDate] = useState<dayjs.Dayjs | null>(null);
  const [draftToDate, setDraftToDate] = useState<dayjs.Dayjs | null>(null);
  const [draftSort, setDraftSort] = useState<GroupSortOption | undefined>(undefined);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter expense groups</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="expense-group-filters-form"
          onSubmit={(e) => {
            e.preventDefault();

            setSearchParams(prev => {
              const params = new URLSearchParams(prev);

              if(draftFromDate){
                params.set("from", draftFromDate.format("YYYY-MM-DD"));
              } else {
                params.delete("from");
              }

              if(draftToDate){
                params.set("to", draftToDate.format("YYYY-MM-DD"));
              } else {
                params.delete("to");
              }
              if(draftSort){
                params.set("sort", draftSort);
              } else {
                params.delete("sort");
              }

              return params;
            })

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
              value={draftFromDate}
              onChange={setDraftFromDate}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              sx={{
                mb:2
              }}
            />

            <DatePicker
              label="To"
              value={draftToDate}
              onChange={setDraftToDate}
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
                value={draftSort}
                onChange={(e) => setDraftSort(e.target.value as GroupSortOption)}
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
        <Button form="expense-group-filters-form" type="submit" variant="contained">
          Apply
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
