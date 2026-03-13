import { Alert, Box, Button, CircularProgress, IconButton, MenuItem, Pagination, Paper, Select, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useIncomes } from "@/features/incomes/hooks/useIncomes";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { use, useEffect, useState } from "react";
import { useDeleteIncome } from "@/features/incomes/hooks/useDeleteIncome";
import { Table, type Column } from "@/shared/ui/Table";
import formatEuros from "@/shared/lib/formatMoney";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import type { Income } from "@/features/incomes/types/incomes.responses";
import { IncomeDialog } from "@/features/incomes/components/IncomeDialog";
import type { IncomeQuery, IncomeSummaryQuery, SummaryType } from "@/features/incomes/types/incomes.requests";
import { IncomesFiltersDialog } from "@/features/incomes/components/filters/IncomesFiltersDialog";
import FilterIcon from '@mui/icons-material/FilterAlt';
import { RowLimitSelect } from "@/shared/ui/RowLimitSelect";
import { ActiveIncomeFilters } from "@/features/incomes/components/filters/ActiveIncomeFilters";
import { useIncomeGroups } from "@/features/income-groups/hooks/useIncomeGroups";
import { MobileTransactionTable } from "@/shared/mobile/MobileTransactionTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useIncomeSummary } from "@/features/incomes/hooks/useIncomeSummary";
import { TimelineChart } from "@/shared/charts/TimelineChart";
import { useSearchParams } from "react-router-dom";
import { TransactionSortOption } from "@/shared/types/commons.types";
import SearchBox from "@/shared/ui/SearchBox";
import dayjs from "dayjs";
import { DetailsDialog } from "@/shared/ui/DetailsDialog";
import { useDownloadFilteredReport } from "../reports/hooks/useDownloadReportPdf";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";

type Range = {
  from: string;
  to: string;
  type: SummaryType
}

export default function IncomesPage() {
  const isMobile = useMediaQuery("(max-width: 700px)");

  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  
  const sortParam = searchParams.get("sort");
  const sort: TransactionSortOption | undefined = 
    sortParam === "amount_asc" ||
    sortParam === "amount_desc" ||
    sortParam === "date_asc" ||
    sortParam === "date_desc" 
      ? sortParam 
      : undefined;

  const search = searchParams.get("search") ?? undefined;

  const limit = Number(searchParams.get("limit")) === 0 ? 10 : Number(searchParams.get("limit"));
  const page = Number(searchParams.get("page")) ?? 1; 

  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");
  const groupIdParam = searchParams.get("group");

  const min = minParam ? Number(minParam) : undefined;
  const max = maxParam ? Number(maxParam) : undefined;
  const group_id = groupIdParam ? Number(groupIdParam) : undefined;

  const [query, setQuery] = useState<IncomeQuery>({
    page,
    limit,
    from,
    to,
    search,
    min,
    max,
    group_id
  })

  const [range, setRange] = useState<"week" | "month" | "year">("week");

  const [summaryQuery, setSummaryQuery] = useState<IncomeSummaryQuery>({
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

  const {data, isError, isLoading} = useIncomes(query);

  const {data: summaryData} = useIncomeSummary(summaryQuery);

  const filteredReport = useDownloadFilteredReport("incomes");

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
  const [detailsOpen, setDetailsOpen] = useState<Income | null>(null);
  const [toFilter, setToFilter] = useState(false);
  const [toClose, setToClose] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  useEffect(() => {
    setQuery(prev => ({
      ...prev,
      from,
      to,
      page,
      limit,
      search,
      sort,
      max,
      min,
      group_id
    }))
  }, [searchParams])


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

  const graphDescriptionText = (from?: string, to?: string) => {
    if (from && to) {
      return `Earnings from ${dayjs(from).format("MMM D, YYYY")} to ${dayjs(to).format("MMM D, YYYY")}`
    } else if (from) {
      return `Earnings from ${dayjs(from).format("MMM D, YYYY")} onwards`
    } else if (to) {
      return `Earnings until ${dayjs(to).format("MMM D, YYYY")}`
    } else {
      return `Earnings across last ${range}`
    }
  };

  return (
    <>
      {/* HEADER */}
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
          Incomes
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

      {/* CHART + RANGE SELECTOR */}
      {!isMobile && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
              {graphDescriptionText(summaryQuery.from, summaryQuery.to)}
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

          <SearchBox/>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >
            <FilterIcon fontSize="small" />
          </Button>

          <RowLimitSelect/>
        </Box>
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

      {/* TABLE */}
      <Paper sx={{ p: 2 }}>
        <ActiveIncomeFilters/>

        {!isMobile && (
          isEmpty ? (
            <EmptyState name="incomes" />
          ) : (
            <Table
              rows={data?.data ?? []}
              columns={columns}
              getRowKey={(income) => income.id}
              onRowClick={(income) =>{
                setDetailsOpen(income);
              }}
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
        open={toFilter}
        onClose={() => setToFilter(false)}
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

      <IncomeDialog 
        open={toCreate} 
        onClose={() => {
          if(formDirty) {
            setToClose(true);
            return;
          }
            setToCreate(false);
          }
        } 
        onChange={setFormDirty}
        onSuccess={() => {
          setToCreate(false);
        }}
      />

      <IncomeDialog
        open={!!toUpdate}
        onClose={() => {
          if(formDirty) {
            setToClose(true);
            return;
          }
          setToUpdate(null);
        }}
        onChange={setFormDirty}
        income={toUpdate}
        onSuccess={() => {
          setToUpdate(null)
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

      <DetailsDialog
        open={!!detailsOpen}
        data={{type: "income", item: detailsOpen}}
        onClose={()=>{
          setDetailsOpen(null);
        }}
        onEdit={() => {
          setToUpdate(detailsOpen);
          setDetailsOpen(null);
        }}
      />
    </>
  );
}