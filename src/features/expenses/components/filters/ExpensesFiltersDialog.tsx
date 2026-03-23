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
  TextField,
  Typography
} from "@mui/material"

import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import SortIcon from "@mui/icons-material/Sort"
import CategoryIcon from "@mui/icons-material/Category"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useSearchParams } from "react-router-dom"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

import type { SortOption } from "@/shared/types/pagination"
import { useExpenseGroups } from "@/features/expense-groups/hooks/useExpenseGroups"

type Props = {
  open: boolean
  onClose: () => void
}

export function ExpensesFiltersDialog({ open, onClose }: Props) {
  const { data } = useExpenseGroups({})
  const [searchParams, setSearchParams] = useSearchParams()

  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")

  const fromDate =
    fromParam && dayjs(fromParam, "YYYY-MM-DD").isValid()
      ? dayjs(fromParam)
      : null

  const toDate =
    toParam && dayjs(toParam, "YYYY-MM-DD").isValid()
      ? dayjs(toParam)
      : null

  const sort = searchParams.get("sort") ?? null
  const minParam = searchParams.get("min")
  const maxParam = searchParams.get("max")
  const groupParam = searchParams.get("group")

  const min = minParam ? Number(minParam) : undefined
  const max = maxParam ? Number(maxParam) : undefined
  const groupId = groupParam ? Number(groupParam) : undefined

  const [draftFrom, setDraftFrom] = useState(fromDate)
  const [draftTo, setDraftTo] = useState(toDate)
  const [draftSort, setDraftSort] = useState<SortOption | "">((sort as SortOption) || "")
  const [draftMin, setDraftMin] = useState<number | "">(min ?? "")
  const [draftMax, setDraftMax] = useState<number | "">(max ?? "")
  const [draftGroupId, setDraftGroupId] = useState<number | "">(groupId ?? "")

  useEffect(() => {
    setDraftFrom(fromDate)
    setDraftTo(toDate)
    setDraftSort((sort as SortOption) || "")
    setDraftMin(min ?? "")
    setDraftMax(max ?? "")
    setDraftGroupId(groupId ?? "")
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
            id="expense-filters-form"
            onSubmit={(e) => {
              e.preventDefault()

              setSearchParams((prev) => {
                const params = new URLSearchParams(prev)

                draftFrom
                  ? params.set("from", draftFrom.format("YYYY-MM-DD"))
                  : params.delete("from")

                draftTo
                  ? params.set("to", draftTo.format("YYYY-MM-DD"))
                  : params.delete("to")

                draftSort
                  ? params.set("sort", draftSort)
                  : params.delete("sort")

                draftMin !== ""
                  ? params.set("min", String(draftMin))
                  : params.delete("min")

                draftMax !== ""
                  ? params.set("max", String(draftMax))
                  : params.delete("max")

                draftGroupId !== ""
                  ? params.set("group", String(draftGroupId))
                  : params.delete("group")

                return params
              })

              onClose()
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachMoneyIcon color="success" fontSize="small" />
                <Typography fontWeight={600}>Amount</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={2}>
                <TextField
                  size="small"
                  label="Minimum"
                  type="number"
                  value={draftMin}
                  onChange={(e) =>
                    setDraftMin(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  fullWidth
                />

                <TextField
                  size="small"
                  label="Maximum"
                  type="number"
                  value={draftMax}
                  onChange={(e) =>
                    setDraftMax(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  fullWidth
                />
              </Stack>
            </Box>

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
                <InputLabel>Sort by</InputLabel>

                <Select
                  label="Sort by"
                  value={draftSort}
                  onChange={(e) =>
                    setDraftSort(e.target.value as SortOption | "")
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="date_desc">Date {"\u2193"}</MenuItem>
                  <MenuItem value="date_asc">Date {"\u2191"}</MenuItem>
                  <MenuItem value="amount_desc">Amount {"\u2193"}</MenuItem>
                  <MenuItem value="amount_asc">Amount {"\u2191"}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CategoryIcon sx={{ color: "#ed6c02" }} fontSize="small" />
                <Typography fontWeight={600}>Group</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <FormControl size="small" fullWidth>
                <InputLabel>Group</InputLabel>

                <Select
                  label="Group"
                  value={draftGroupId}
                  onChange={(e) =>
                    setDraftGroupId(e.target.value as number | "")
                  }
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
          </Stack>
        </Box>

        <Box mt={2}>
          <Divider sx={{ mb: 2 }} />

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              form="expense-filters-form"
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
