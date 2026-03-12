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
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TransactionSortOption } from "@/shared/types/commons.types";
import { useIncomeGroups } from "@/features/income-groups/hooks/useIncomeGroups";

export type IncomeFilterValues = {
  from?: string;
  to?: string;
  sort?: TransactionSortOption;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function IncomesFiltersDialog({ open, onClose }: Props) {
  const { data } = useIncomeGroups({});

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

  const min = Number(searchParams.get("min")) || undefined;
  const max = Number(searchParams.get("max")) || undefined;

  const [draftFrom, setDraftFrom] = useState<dayjs.Dayjs | null>(fromDate || null);
  const [draftTo, setDraftTo] = useState<dayjs.Dayjs | null>(toDate || null);
  const [draftSort, setDraftSort] = useState(sort);
  const [draftMin, setDraftMin] = useState(min || "");
  const [draftMax, setDraftMax] = useState(max || "");
  const [draftGroupId, setDraftGroupId] = useState<number | "">("");

  useEffect(()=>{
    setDraftFrom(fromDate || null);
    setDraftTo(toDate || null);
    setDraftSort(sort);
    setDraftMin(min || "");
    setDraftMax(max || "");
    setDraftGroupId(searchParams.get("group") ? Number(searchParams.get("group")) : "");
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
                params.set("from", draftFrom.format("YYYY-MM-DD"));
              } else {
                params.delete("from");
              }
              if(draftTo){
                params.set("to", draftTo.format("YYYY-MM-DD"));
              } else {
                params.delete("to");
              }
              if(draftSort){
                params.set("sort", draftSort);
              } else {
                params.delete("sort");
              }
              if(draftMin) {
                params.set("min", String(draftMin));
              } else {
                params.delete("min");
              }
              if(draftMax) {
                params.set("max", String(draftMax));
              } else {
                params.delete("max");
              }
              if(draftGroupId) {
                params.set("group", String(draftGroupId))
              } else {
                params.delete("group");
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
              Amount
            </Typography>

            <TextField
              size="small"
              label="Min"
              type="number"
              value={draftMin}
              onChange={(e) => setDraftMin(e.target.value === "" ? "" : Number(e.target.value))}
              fullWidth
              sx={{
                mb:2
              }}
            />

            <TextField
              size="small"
              label="Max"
              type="number"
              value={draftMax}
              onChange={(e) => setDraftMax(e.target.value === "" ? "" : Number(e.target.value))}
              fullWidth
            />
          </Box>


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
                <MenuItem value="amount_desc">Amount ↓</MenuItem>
                <MenuItem value="amount_asc">Amount ↑</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
                value={draftGroupId}
                onChange={(e) => setDraftGroupId(e.target.value as number | "")}
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
