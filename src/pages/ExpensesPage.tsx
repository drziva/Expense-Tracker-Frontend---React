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
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material"

import { useExpenses } from "../hooks/expenses/useExpenses"
import { useDeleteExpense } from "../hooks/expenses/useDeleteExpense"
import { useExpenseSummary } from "../hooks/expenses/useExpenseSummary"
import { useExpenseGroups } from "../hooks/expense-groups/useExpenseGroups"

import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import FilterIcon from "@mui/icons-material/FilterAlt"

import { useEffect, useState } from "react"

import { Table, type Column } from "../components/ui/Table"
import { RowLimitSelect } from "../components/ui/RowLimitSelect"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"

import { TimelineChart } from "../components/common/charts/TimelineChart"

import { ExpenseDialog } from "../components/expenses/ExpenseDialog"
import { ExpensesFiltersDialog } from "../components/filters/expenses/ExpensesFiltersDialog"
import { ActiveExpenseFilters } from "../components/filters/expenses/ActiveExpenseFilters"

import { MobileTransactionTable } from "../components/mobile/MobileTransactionTable"

import formatEuros from "../utils/formatMoney"

import type { Expense } from "../types/expenses.responses"
import type {
  ExpenseQuery,
  ExpenseSummaryQuery
} from "../types/expenses.requests"
import { SummaryType } from "../types/incomes.requests"

type Range = {
  from: string
  to: string,
  type: SummaryType
}

export default function ExpensesPage() {

  const isMobile = useMediaQuery("(max-width: 600px)")

  const [query, setQuery] = useState<ExpenseQuery>({
    page: 1,
    limit: 10
  })

  const [range, setRange] = useState<"week" | "month" | "year">("week")

  const [summaryQuery, setSummaryQuery] = useState<ExpenseSummaryQuery>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    to: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    type: range === "year" ? "yearly" : "regular"
  })

  const { data, isError, isLoading } = useExpenses(query)
  const { data: summaryData } = useExpenseSummary(summaryQuery)

  const deleteExpense = useDeleteExpense()

  const groupsData = useExpenseGroups({}).data
  const groups = groupsData?.data ?? []

  const groupNameById: Record<number, string> = {}

  for (const g of groups) {
    groupNameById[g.id] = g.name
  }

  const [toCreate, setToCreate] = useState(false)
  const [toUpdate, setToUpdate] = useState<Expense | null>(null)
  const [toDelete, setToDelete] = useState<Expense | null>(null)
  const [toFilter, setToFilter] = useState(false)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(prev => ({
        ...prev,
        search: searchText,
        page: 1
      }))
    }, 500)

    return () => clearTimeout(timeout)

  }, [searchText])

  useEffect(() => {

    if (!query.search && searchText !== "") {
      setSearchText("")
    }

  }, [query])

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
          <Tooltip
            title="Edit"
          >
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
          <Tooltip 
              title="Delete"
            >
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

  const timelineData = summaryData?.map(point => ({
    date: point.date,
    total: Number(point.total)
  })) ?? []

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
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1
        }}
      >

        <Typography
          variant={isMobile ? "h6" : "h4"}
          fontWeight={600}
        >
          Expenses
        </Typography>

      </Box>

      {/* CHART */}

      {!isMobile && (

        <Box sx={{ mb: 1 }}>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 0
            }}
          >

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ ml: 2}}
            >
              Spending across <strong>{`last ${range}`}</strong>
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

          <TextField
            size="small"
            label="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              height: 40,
              minWidth: isMobile ? null : 450
            }}
          />

          <Button
            variant="outlined"
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >

            <FilterIcon fontSize="small" />

          </Button>

          <RowLimitSelect
            value={query.limit}
            onChange={(limit) =>
              setQuery(prev => ({
                ...prev,
                limit,
                page: 1
              }))
            }
          />

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

      {/* TABLE */}

      <Paper sx={{ p: 2 }}>

        <ActiveExpenseFilters
          groups={groupNameById}
          query={query}
          onChange={setQuery}
        />

        {!isMobile && (

          isEmpty
            ? <EmptyState name="expenses" />
            : (
              <Table
                rows={data?.data ?? []}
                columns={columns}
                getRowKey={(expense) => expense.id}
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

      {/* PAGINATION */}

      <Pagination
        shape="rounded"
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          mr: 2,
          mt: 2
        }}
        count={data?.totalPages}
        onChange={(_, value) =>
          setQuery(prev => ({
            ...prev,
            page: value
          }))
        }
        hideNextButton={isEmpty}
        hidePrevButton={isEmpty}
      />

      {/* DIALOGS */}

      <ExpensesFiltersDialog
        query={query}
        open={toFilter}
        onClose={() => setToFilter(false)}
        onApply={(filters) => {

          setQuery(prev => ({
            ...prev,
            ...filters,
            page: 1
          }))

        }}
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
        onClose={() => setToCreate(false)}
      />

      <ExpenseDialog
        open={!!toUpdate}
        onClose={() => setToUpdate(null)}
        expense={toUpdate}
      />

    </>
  )
}