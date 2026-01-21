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
import type { GroupSortOption } from "../../../types/pagination";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export type IncomeFilterValues = {
  from?: string;
  to?: string;
  sort?: GroupSortOption;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
};

export function IncomeGroupsFiltersDialog({ open, onClose, onApply }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  const fromDate = 
    fromParam && dayjs(fromParam,"YYYY-MM-DD").isValid()
      ? dayjs(fromParam, "YYYY-MM-DD")
      : null;

  const toParam = searchParams.get("to");
  const toDate = 
    toParam && dayjs(toParam,"YYYY-MM-DD").isValid()
      ? dayjs(toParam, "YYYY-MM-DD")
      : null;

  const sort = searchParams.get("sort") ?? null;

  const [draftFrom, setDraftFrom] = useState<dayjs.Dayjs | null>(fromDate || null);
  const [draftTo, setDraftTo] = useState<dayjs.Dayjs | null>(toDate || null);
  const [draftSort, setDraftSort] = useState(sort);

  useEffect(()=>{
    setDraftFrom(fromDate || null);
    setDraftTo(toDate || null);
    setDraftSort(sort);
  },[searchParams])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter income groups</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="income-group-filters-form"
          onSubmit={(e) => {
            e.preventDefault();

            setSearchParams(prev => {
              const params = new URLSearchParams(prev);
              if(draftFrom){
                params.set("from", draftFrom.format("YYYY-MM-DD"))
              } else {
                params.delete("from")
              }
              if(draftTo){
                params.set("to", draftTo.format("YYYY-MM-DD"))
              } else {
                params.delete("to")
              }
              if(draftSort){
                params.set("sort", draftSort)
              } else {
                params.delete("to")
              }

              return params;
            })

            onApply();
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
              value={draftFrom}
              onChange={(val)=>{
                setDraftFrom(val)
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              sx={{
                mb:2
              }}
            />

            <DatePicker
              label="To"
              value={draftTo}
              onChange={(val)=>{
                setDraftTo(val)
              }}
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
                value = {draftSort}
                onChange={(e)=>{
                  setDraftSort(e.target.value)
                }}
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
