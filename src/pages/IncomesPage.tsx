import { Alert, Box, Button, CircularProgress, IconButton, MenuItem, Pagination, Paper, Select, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useIncomes } from "../hooks/incomes/useIncomes";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { useEffect, useState } from "react";
import { useDeleteIncome } from "../hooks/incomes/useDeleteIncome";
import { Table, type Column } from "../components/ui/Table";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Income } from "../types/incomes.responses";
import { IncomeDialog } from "../components/incomes/IncomeDialog";
import type { IncomeQuery, IncomeSummaryQuery, SummaryType } from "../types/incomes.requests";
import { IncomesFiltersDialog } from "../components/filters/incomes/IncomesFiltersDialog";
import FilterIcon from '@mui/icons-material/FilterAlt';
import { RowLimitSelect } from "../components/ui/RowLimitSelect";
import { ActiveIncomeFilters } from "../components/filters/incomes/ActiveIncomeFilters";
import { useIncomeGroups } from "../hooks/income-groups/useIncomeGroups";
import { MobileTransactionTable } from "../components/mobile/MobileTransactionTable";
import { EmptyState } from "../components/ui/EmptyState";
import { useIncomeSummary } from "../hooks/incomes/useIncomeSummary";
import { TimelineChart } from "../components/common/charts/TimelineChart";

type Range = {
  from: string;
  to: string;
  type: SummaryType
}

export default function IncomesPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [query, setQuery] = useState<IncomeQuery>({
    page:1,
    limit: 10
  })

  const [range, setRange] = useState<"week" | "month" | "year">("week");

  const [summaryQuery, setSummaryQuery] = useState<IncomeSummaryQuery>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    to: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    type: range === "year" ? "yearly" : "regular"
  });

  const {data, isError, isLoading} = useIncomes(query);

  const {data: summaryData} = useIncomeSummary(summaryQuery);

  const deleteIncome = useDeleteIncome();

  const groupsData = useIncomeGroups({}).data;
  const groups = groupsData?.data ?? [];
  const groupNameById: Record<number, string> = {};
  for (const g of groups) {
    groupNameById[g.id] = g.name;
  }

  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<Income | null>(null);
  const [toDelete, setToDelete] = useState<Income | null>(null);
  const [toFilter, setToFilter] = useState(false);
  const [searchText, setSearchText] = useState("");


  useEffect(()=>{
    const timeout = setTimeout(() => {
      setQuery(prev => ({
        ...prev,
        search: searchText,
        page: 1
      }))
    }, 500)

    return() => clearTimeout(timeout);
  }, [searchText])

  useEffect(() => {
    if (!query.search && searchText !== "") {
      setSearchText("");
    }
  }, [query]);

  if(isLoading) return <CircularProgress />

  if(isError) return <Alert severity="error">Failed to load incomes.</Alert>

  const isEmpty = data?.data.length === 0;
  
  const columns: Column<Income>[] = [
    {
      key: "description",
      header: "Description",
      render: income => income.description,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: income => formatEuros(income.amount),
    },
    {
      key: "date",
      header: "Date",
      render: income =>
        new Date(income.createdAt).toLocaleDateString(),
    },
    {
      key: "group",
      header: "Group",
      render: income => income.groupName,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: income => (
        <>
          <Tooltip
            title="Edit"
          >
            <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation()
              setToUpdate(income)
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
                  setToDelete(income)
                }}
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const timelineData = summaryData?.map((point) => ({
    date: point.date,
    total: Number(point.total),
  })) ?? [];

  console.log("summaryData", summaryData);
  console.log("timelineData", timelineData);

  const getRange = (range: string): Range => {
    const now = new Date()

    if (range === "week") {
      const from = new Date()
      from.setDate(now.getDate() - 7)

      return { from: from.toISOString(), to: now.toISOString(), type: "regular" }
    }

    if (range === "month") {
      const from = new Date()
      from.setMonth(now.getMonth() - 1)


      return { from: from.toISOString(), to: now.toISOString(), type: "regular" }
    }

    if (range === "year") {
      const from = new Date()
      from.setFullYear(now.getFullYear() - 1)

      return { from: from.toISOString(), to: now.toISOString(), type: "yearly" }
    }

    throw new Error("Invalid range");
  }

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant={isMobile ? "h6" : "h4"} fontWeight={600} mb={1}>
          Incomes
        </Typography>

      </Box>

      {/* CHART + RANGE SELECTOR */}
      {!isMobile && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
              Earnings across {<strong>{`last ${range}`}</strong>}
            </Typography>

            <Select
              sx={{ml: 2}}
              value={range}
              size="small"
              onChange={(e) => {
                const value = e.target.value as "week" | "month" | "year";

                const range = getRange(value);
                setRange(value);

                setSummaryQuery({
                  from: range?.from,
                  to: range?.to,
                  type: range?.type ?? "regular"
                });
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
              backgroundColor: "background.paper",
            }}
          >
            <TimelineChart data={timelineData} color="income" type={range} />
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
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "2px",
            justifyContent: isMobile ? "center" : "left",
          }}
        >
          <TextField
            size="small"
            label="Search"
            color="primary"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              height: 40,
              minWidth: isMobile ? null : 450,
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >
            <FilterIcon fontSize="small" />
          </Button>

          <RowLimitSelect
            value={query.limit}
            onChange={(limit) =>
              setQuery((prev) => ({ ...prev, limit, page: 1 }))
            }
          />
        </Box>
      
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "right",
          }}
        >
          
          <Button
            onClick={() => setToCreate(true)}
            variant="contained"
            sx={{
              height: 40,
              fontSize: "0.8rem",
              lineHeight: "1.3",
            }}
          >
          <strong>Add Income</strong>
        </Button>
        </Box>
      </Box>

      {/* TABLE */}
      <Paper sx={{ p: 2 }}>
        <ActiveIncomeFilters
          groups={groupNameById}
          query={query}
          onChange={setQuery}
        />

        {!isMobile && (
          isEmpty ? (
            <EmptyState name="incomes" />
          ) : (
            <Table
              rows={data?.data ?? []}
              columns={columns}
              getRowKey={(income) => income.id}
            />
          )
        )}

        {isMobile && (
          isEmpty ? (
            <EmptyState name="incomes" />
          ) : (
            <MobileTransactionTable
              data={data?.data}
              onDelete={setToDelete}
              onEdit={setToUpdate}
              color="success"
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
          mt: 2,
        }}
        count={data?.totalPages}
        onChange={(_, value) =>
          setQuery((prev) => ({ ...prev, page: value }))
        }
        hideNextButton={isEmpty}
        hidePrevButton={isEmpty}
      />

      {/* DIALOGS */}
      <IncomesFiltersDialog
        query={query}
        open={toFilter}
        onClose={() => setToFilter(false)}
        onApply={(filters) => {
          setQuery((prev) => ({
            ...prev,
            ...filters,
            page: 1,
          }));
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete income"
        action="Delete"
        description={`Are you sure you want to delete "${toDelete?.description}"`}
        loading={deleteIncome.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          deleteIncome.mutate(toDelete.id);
          setToDelete(null);
        }}
      />

      <IncomeDialog open={toCreate} onClose={() => setToCreate(false)} />

      <IncomeDialog
        open={!!toUpdate}
        onClose={() => setToUpdate(null)}
        income={toUpdate}
      />
    </>
  );
}