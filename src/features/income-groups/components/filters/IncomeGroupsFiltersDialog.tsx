import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material"

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import SortIcon from "@mui/icons-material/Sort"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import type { GroupSortOption } from "@/shared/types/pagination"
import { useSearchParams } from "react-router-dom"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

export type IncomeFilterValues = {
  from?: string
  to?: string
  sort?: GroupSortOption
}

type Props = {
  open: boolean
  onClose: () => void
}

export function IncomeGroupsFiltersDialog({ open, onClose }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()

  const fromParam = searchParams.get("from")
  const fromDate =
    fromParam && dayjs(fromParam, "YYYY-MM-DD").isValid()
      ? dayjs(fromParam, "YYYY-MM-DD")
      : null

  const toParam = searchParams.get("to")
  const toDate =
    toParam && dayjs(toParam, "YYYY-MM-DD").isValid()
      ? dayjs(toParam, "YYYY-MM-DD")
      : null

  const sort = searchParams.get("sort") ?? null

  const [draftFrom, setDraftFrom] = useState<dayjs.Dayjs | null>(fromDate || null)
  const [draftTo, setDraftTo] = useState<dayjs.Dayjs | null>(toDate || null)
  const [draftSort, setDraftSort] = useState<GroupSortOption | "">((sort as GroupSortOption) || "")

  useEffect(() => {
    setDraftFrom(fromDate || null)
    setDraftTo(toDate || null)
    setDraftSort((sort as GroupSortOption) || "")
  }, [searchParams])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 }
        }
      }}
    >
      <Box
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Filters
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflow: "auto", pr: 1 }}>
          <Stack
            spacing={3}
            component="form"
            id="income-group-filters-form"
            onSubmit={(e) => {
              e.preventDefault()

              setSearchParams((prev) => {
                const params = new URLSearchParams(prev)

                if (draftFrom) {
                  params.set("from", draftFrom.format("YYYY-MM-DD"))
                } else {
                  params.delete("from")
                }

                if (draftTo) {
                  params.set("to", draftTo.format("YYYY-MM-DD"))
                } else {
                  params.delete("to")
                }

                if (draftSort) {
                  params.set("sort", draftSort)
                } else {
                  params.delete("sort")
                }

                return params
              })

              onClose()
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonthIcon color="primary" fontSize="small" />
                <Typography fontWeight={600}>Date range</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={2}>
                <DatePicker
                  label="From"
                  value={draftFrom}
                  onChange={setDraftFrom}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />

                <DatePicker
                  label="To"
                  value={draftTo}
                  onChange={setDraftTo}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Stack>
            </Box>

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
                  <MenuItem value="date_desc">Date {"\u2193"}</MenuItem>
                  <MenuItem value="date_asc">Date {"\u2191"}</MenuItem>
                  <MenuItem value="name_desc">Name {"\u2193"}</MenuItem>
                  <MenuItem value="name_asc">Name {"\u2191"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        <Box mt={2}>
          <Divider sx={{ mb: 2 }} />

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              form="income-group-filters-form"
              type="submit"
              variant="contained"
            >
              Apply
            </Button>

            <Button fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
