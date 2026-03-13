import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material"

import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import FilterIcon from "@mui/icons-material/FilterAlt"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { useExpenses } from "@/features/expenses/hooks/useExpenses"
import { useDeleteExpense } from "@/features/expenses/hooks/useDeleteExpense"
import { useExpenseSummary } from "@/features/expenses/hooks/useExpenseSummary"
import { useExpenseGroups } from "@/features/expense-groups/hooks/useExpenseGroups"

import { Table, type Column } from "@/shared/ui/Table"
import { RowLimitSelect } from "@/shared/ui/RowLimitSelect"
import ConfirmDialog from "@/shared/ui/ConfirmDialog"
import { EmptyState } from "@/shared/ui/EmptyState"
import PictureAsPdf from "@mui/icons-material/PictureAsPdf"

import { TimelineChart } from "@/shared/charts/TimelineChart"

import { ExpenseDialog } from "@/features/expenses/components/ExpenseDialog"
import { ExpensesFiltersDialog } from "@/features/expenses/components/filters/ExpensesFiltersDialog"
import { ActiveExpenseFilters } from "@/features/expenses/components/filters/ActiveExpenseFilters"

import { MobileTransactionTable } from "@/shared/mobile/MobileTransactionTable"

import formatEuros from "@/shared/lib/formatMoney"

import type { Expense } from "@/features/expenses/types/expenses.responses"
import type { ExpenseQuery, ExpenseSummaryQuery } from "@/features/expenses/types/expenses.requests"
import { SummaryType } from "@/features/incomes/types/incomes.requests"
import { TransactionSortOption } from "@/shared/types/commons.types"

import SearchBox from "@/shared/ui/SearchBox"
import dayjs from "dayjs"

import { DetailsDialog } from "@/shared/ui/DetailsDialog"
import { useDownloadFilteredReport, useDownloadReportPdf } from "../reports/hooks/useDownloadReportPdf"

type Range = {
  from: string
  to: string
  type: SummaryType
}

export default function ExpensesPage() {
  const [formDirty, setFormDirty] = useState(false);

  const isMobile = useMediaQuery("(max-width: 600px)")
  const [searchParams, setSearchParams] = useSearchParams()

  const fromParam = searchParams.get("from")
  const from =
    fromParam && dayjs(fromParam, "YYYY-MM-DD").isValid()
      ? fromParam
      : undefined

  const toParam = searchParams.get("to")
  const to =
    toParam && dayjs(toParam, "YYYY-MM-DD").isValid()
      ? toParam
      : undefined

  const search = searchParams.get("search") ?? undefined

  const sortParam = searchParams.get("sort")
  const sort: TransactionSortOption | undefined =
    sortParam === "amount_asc" ||
    sortParam === "amount_desc" ||
    sortParam === "date_asc" ||
    sortParam === "date_desc"
      ? sortParam
      : undefined

  const limit = Number(searchParams.get("limit")) || 10
  const page = Number(searchParams.get("page")) || 1

  const minParam = searchParams.get("min")
  const maxParam = searchParams.get("max")
  const groupParam = searchParams.get("group")

  const min = minParam !== null ? Number(minParam) : undefined
  const max = maxParam !== null ? Number(maxParam) : undefined
  const group_id = groupParam !== null ? Number(groupParam) : undefined

  const query: ExpenseQuery = {
    page,
    limit,
    from,
    to,
    search,
    sort,
    min,
    max,
    group_id
  }

  const [range, setRange] = useState<"week" | "month" | "year">("week")

  const [summaryQuery, setSummaryQuery] = useState<ExpenseSummaryQuery>({
    from: from || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    to: to || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    type: range === "year" ? "yearly" : "regular"
  });

  useEffect(()=>{
    setSummaryQuery({
      from: from || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
      to: to || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      type: range === "year" ? "yearly" : "regular"
    });
  },[from,to])

  const { data, isError, isLoading } = useExpenses(query)
  const { data: summaryData } = useExpenseSummary(summaryQuery)
  const filteredReport = useDownloadFilteredReport("expenses");

  const deleteExpense = useDeleteExpense()

  const groupsData = useExpenseGroups({}).data
  const groups = groupsData?.data ?? []

  const [toCreate, setToCreate] = useState(false)
  const [toUpdate, setToUpdate] = useState<Expense | null>(null)
  const [toDelete, setToDelete] = useState<Expense | null>(null)
  const [detailsOpen, setDetailsOpen] = useState<Expense | null>(null)
  const [toFilter, setToFilter] = useState(false)
  const [toClose, setToClose] = useState(false)

  if (isLoading) return <CircularProgress />
  if (isError) return <Alert severity="error">Failed to load expenses.</Alert>

  const isEmpty = data?.data.length === 0

  const columns: Column<Expense>[] = [
    {
      key: "description",
      header: "Description",
      render: expense => expense.description
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: expense => formatEuros(expense.amount)
    },
    {
      key: "date",
      header: "Date",
      render: expense =>
        new Date(expense.createdAt).toLocaleDateString()
    },
    {
      key: "group",
      header: "Group",
      render: expense => expense.groupName
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: expense => (
        <>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation()
                setToUpdate(expense)
              }}
            >
              <EditIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation()
                setToDelete(expense)
              }}
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ]

  const timelineData =
    summaryData?.map(point => ({
      date: point.date,
      total: Number(point.total)
    })) ?? []

  const graphDescriptionText = (from?: string, to?: string) => {
    if (from && to) {
      return `Spending from ${dayjs(from).format("MMM D, YYYY")} to ${dayjs(to).format("MMM D, YYYY")}`
    } else if (from) {
      return `Spending from ${dayjs(from).format("MMM D, YYYY")} onwards`
    } else if (to) { 
      return `Spending until ${dayjs(to).format("MMM D, YYYY")}`
    } else {
      return `Spending across last ${range}`
    }
  }
  
  const getRange = (range: string): Range => {

    const now = new Date()

    if (range === "week") {
      const from = new Date()
      from.setDate(now.getDate() - 7)

      return {
        from: from.toISOString(),
        to: now.toISOString(),
        type: "regular"
      }
    }

    if (range === "month") {
      const from = new Date()
      from.setMonth(now.getMonth() - 1)

      return {
        from: from.toISOString(),
        to: now.toISOString(),
        type: "regular"
      }
    }

    if (range === "year") {
      const from = new Date()
      from.setFullYear(now.getFullYear() - 1)

      return {
        from: from.toISOString(),
        to: now.toISOString(),
        type: "yearly"
      }
    }

    throw new Error("Invalid range")
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >      
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          fontWeight={600}
          sx={{
            mb: 2,
            mt: 1,
            ml: 1
          }}
        >
          Expenses
        </Typography>
        <Button
          onClick={() => {
            filteredReport.mutateAsync(query)
          }}
          sx={{
            height: 40,
            fontSize: "0.8rem",

          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Export Table</Typography>
            <PictureAsPdf fontSize="small" />
          </Stack>
        </Button>
      </Box>

      {!isMobile && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
              {graphDescriptionText(summaryQuery.from, summaryQuery.to)}
            </Typography>

            <Select
              sx={{ ml: 2 }}
              value={range}
              size="small"
              onChange={(e) => {

                const value = e.target.value as "week" | "month" | "year"
                const range = getRange(value)

                setRange(value)

                setSummaryQuery({
                  from: range.from,
                  to: range.to,
                  type: range.type
                })

              }}
            >
              <MenuItem value="week">Last week</MenuItem>
              <MenuItem value="month">Last month</MenuItem>
              <MenuItem value="year">Last year</MenuItem>
            </Select>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.paper"
            }}
          >
            <TimelineChart data={timelineData} color="expense" type={range} />
          </Box>
        </Box>
      )}

      {/* SEARCH + FILTERS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: "10px",
          mb: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "2px",
            justifyContent: isMobile ? "center" : "left"
          }}
        >

          <SearchBox />

          <Button
            variant="outlined"
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >
            <FilterIcon fontSize="small" />
          </Button>

          <RowLimitSelect />

        </Box>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{
            height: 40,
            fontSize: "0.8rem",
            lineHeight: "1.3"
          }}
        >
          <strong>Add Expense</strong>
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>

        <ActiveExpenseFilters />

        {!isMobile && (
          isEmpty
            ? <EmptyState name="expenses" />
            : (
              <Table
                rows={data?.data ?? []}
                columns={columns}
                getRowKey={(expense) => expense.id}
                onRowClick={(expense) => {
                  setDetailsOpen(expense);
                }}
              />
            )
        )}

        {isMobile && (
          isEmpty
            ? <EmptyState name="expenses" />
            : (
              <MobileTransactionTable
                data={data?.data}
                onDelete={setToDelete}
                onEdit={setToUpdate}
                color="error"
              />
            )
        )}

      </Paper>

      <Pagination
        shape="rounded"
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2
        }}
        count={data?.totalPages}
        onChange={(_, value) =>
          setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            params.set("page", String(value))
            return params
          })
        }
        hideNextButton={isEmpty}
        hidePrevButton={isEmpty}
      />

      <ExpensesFiltersDialog
        open={toFilter}
        onClose={() => setToFilter(false)}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete expense"
        action="Delete"
        description={`Are you sure you want to delete "${toDelete?.description}"`}
        loading={deleteExpense.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          deleteExpense.mutate(toDelete.id)
          setToDelete(null)
        }}
      />

      <ExpenseDialog
        open={toCreate}
        onClose={() => {
            if(formDirty) {
              setToClose(true);
              return;
            }
            setToCreate(false)
          }
        }
        onChange={()=>{
          setFormDirty(true)
        }}
        onSuccess={() => {
          setToCreate(false);
        }}
      />

      <ConfirmDialog
        open={toClose}
        title="Unsaved changes"
        action="Discard"
        description="You have unsaved changes. Are you sure you want to discard them?"
        onCancel={()=>{
          setToClose(false);
        }}
        onConfirm={()=>{
          setToClose(false);
          setToCreate(false);
          setFormDirty(false);
          setToUpdate(null);
        }}
      />

      <ExpenseDialog
        open={!!toUpdate}
        onClose={() => {
          if(formDirty) {
            setToClose(true);
            return;
          }
          setToUpdate(null)
          }
        }
        onChange={setFormDirty}
        expense={toUpdate}
        onSuccess={() => {
          setToUpdate(null);
        }}
      />

      <DetailsDialog
        open={!!detailsOpen}
        data={{type:"expense", item: detailsOpen}}
        onClose={() => {
          setDetailsOpen(null);
        }}
        onEdit={() => {
          setToUpdate(detailsOpen);
          setDetailsOpen(null);
        }}
      />

    </>
  )
}