import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useExpenseGroups } from "@/features/expense-groups/hooks/useExpenseGroups";
import { type Column } from "@/shared/ui/Table";
import { Table } from "@/shared/ui/Table";
import type { ExpenseGroup } from "@/features/expense-groups/types/expenseGroup.responses";
import { useActionState, useEffect, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import { useDeleteExpenseGroup } from "@/features/expense-groups/hooks/useDeleteExpenseGroups";
import { ExpenseGroupDialog } from "@/features/expense-groups/components/ExpenseGroupDialog";
import type { ExpenseGroupQuery } from "@/features/expense-groups/types/expenseGroup.requests";
import { ExpenseGroupsFiltersDialog } from "@/features/expense-groups/components/filters/ExpenseGroupsFiltersDialog";
import FilterIcon from "@mui/icons-material/FilterAlt";
import { RowLimitSelect } from "@/shared/ui/RowLimitSelect";
import { ActiveExpenseGroupsFilters } from "@/features/expense-groups/components/filters/ActiveExpenseGroupsFilters";
import { MobileExpenseGroupTable } from "@/shared/mobile/MobileExpenseGroupTable";
import formatEuros from "@/shared/lib/formatMoney";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import type { GroupSortOption } from "@/shared/types/pagination";
import SearchBox from "@/shared/ui/SearchBox";
import { useExpenseTotalByGroup } from "@/features/expense-groups/hooks/useExpenseTotalByGroup";
import { GroupBarChart } from "@/shared/charts/GroupBarChart";
import { DetailsDialog } from "@/shared/ui/DetailsDialog";
import { formatBarChartData } from "@/shared/charts/utils/formatChartData";
import { set } from "zod";

export default function ExpenseGroupsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const deleteExpenseGroup = useDeleteExpenseGroup();

  const [searchParams, setSearchParams] = useSearchParams();
  const [toDelete, setToDelete] = useState<ExpenseGroup | null>(null);
  const [prevDelete, setPrevDelete] = useState<ExpenseGroup | null>(null);
  const [toUpdate, setToUpdate] = useState<ExpenseGroup | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<ExpenseGroup | null>(null);
  const [toCreate, setToCreate] = useState(false);
  const [toFilter, setToFilter] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [toClose, setToClose] = useState(false);

  const fromParam = searchParams.get("from");
  const from = 
    fromParam && 
    dayjs(fromParam,"YYYY-MM-DD",true).isValid()
    ? fromParam 
    : undefined;
  const toParam = searchParams.get("to");
  const to = 
    toParam && 
    dayjs(toParam,"YYYY-MM-DD",true).isValid()
    ? toParam 
    : undefined;  

  const sortParam = searchParams.get("sort");
  const sort: GroupSortOption | undefined = 
    sortParam === "date_asc" ||
    sortParam === "date_desc" ||
    sortParam === "name_asc" ||
    sortParam === "name_desc"
    ? sortParam 
    : undefined;
  
  const search = searchParams.get("search") ?? undefined;
  const limit = Number(searchParams.get("limit")) === 0 ? 10 : Number(searchParams.get("limit"));
  const page = Number(searchParams.get("page")) ?? 1;

  const [query, setQuery] = useState<ExpenseGroupQuery>({
    page,
    limit,
    search,
    from,
    to,
    sort
  });
  
  const { data, isError, isPending } = useExpenseGroups(query);

  const {data: summaryData} = useExpenseTotalByGroup();

  
  // DATA FORMATTING - SORT + LIMIT TO 5 TOP + AGGEGATE OTHERS INTO "OTHER"
  const formattedData = useMemo(() => {
    if(!summaryData?.length) {
      return [];
    }
    return formatBarChartData(summaryData);
  }, [summaryData]);
  
  useEffect(() => {
    setQuery(prev => ({
      ...prev,
      from,
      to,
      sort,
      search,
      limit,
      page
    }))
  },[searchParams])

  if (isError)
    return (
      <Alert severity="error">
        There has been an error loading expense groups
      </Alert>
    );

  if (isPending) return <CircularProgress />;

  const isEmpty = data?.data.length === 0;

  const columns: Column<ExpenseGroup>[] = [
    {
      key: "name",
      header: "Name",
      render: group => group.name,
    },
    {
      key: "description",
      header: "Description",
      render: group => (
        <Typography variant="body2" color="text.secondary">
          {group.description}
        </Typography>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: group =>
        new Date(group.createdAt).toLocaleDateString(),
    },
    {
      key: "budget-cap",
      header: "Budget Cap",
      render: group => (
        group.budgetCap ? formatEuros(group.budgetCap) : "-"
      )
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: gr => (
        <>
          <Tooltip
            title="Edit"
          >
            <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation()
              setToUpdate(gr)
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
                  setToDelete(gr)
                  setPrevDelete(gr);
                }}
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];



 return (
  <>
    {/* HEADER */}

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2
      }}
    >
      <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight={600}
            sx={{
              mb: 0,
              mt: 1,
              ml: isMobile ? 2 : 1
            }}
          >
            Expense Groups
          </Typography>

        {!isMobile && (
          <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
              ml: 2,
            }}
          >
            Total Expense Distribution by Group
          </Typography>
        )}
      </Box>
    </Box>

    {/* CHART */}

    {!isMobile && formattedData && formattedData.length > 0 && (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "background.paper"
          }}
        >
          <GroupBarChart data={formattedData ? formattedData : []} />
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
          color="primary"
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
        <strong>Add Group</strong>
      </Button>
    </Box>

    {/* TABLE */}

    <Paper sx={{ p: 2 }}>
      <ActiveExpenseGroupsFilters />

      {!isMobile && (
        isEmpty
          ? <EmptyState name="expense groups" />
          : (
            <Table
              rows={data.data}
              columns={columns}
              getRowKey={(gr) => gr.id}
              onRowClick={(gr) => {
                setDetailsOpen(gr);
              }}
            />
          )
      )}

      {isMobile && (
        isEmpty
          ? <EmptyState name="expense groups" />
          : (
            <MobileExpenseGroupTable
              data={data.data}
              onDelete={setToDelete}
              onEdit={setToUpdate}
              onClick={setDetailsOpen}
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
        setQuery((prev) => ({
          ...prev,
          page: value
        }))
      }
      hideNextButton={isEmpty}
      hidePrevButton={isEmpty}
    />

    {/* DIALOGS */}

    <ExpenseGroupsFiltersDialog
      open={toFilter}
      onClose={() => setToFilter(false)}
    />

    <ConfirmDialog
      title="Delete Expense Group"
      action="Delete"
      description={`Are you sure you want to delete the "${prevDelete?.name}" group?`}
      open={!!toDelete}
      onConfirm={() => {
        if (!toDelete) return
        deleteExpenseGroup.mutate(toDelete.id)
        setToDelete(null)
      }}
      onCancel={() => setToDelete(null)}
    />

    <ExpenseGroupDialog
      open={toCreate}
      title="Create"
      onClose={() => {
        if(formDirty) {
          setToClose(true);
          return;
        }
        setToCreate(false);
        setFormDirty(false);
      }}
      onChange={setFormDirty}
      onSuccess={() => {
        setToCreate(false);
      }}
    />

    <ExpenseGroupDialog
      open={!!toUpdate}
      title="Edit"
      onClose={() => {
        if(formDirty) {
          setToClose(true);
          return;
        }
        setToUpdate(null)}
      }
      onChange={setFormDirty}
      group={toUpdate}
      onSuccess={() => {
        setToUpdate(null)
      }}
    />

    <ConfirmDialog
      open={toClose}
      title="Unsaved Changes"
      description="You have unsaved changes. Are you sure you want to discard them?"
      action="Discard"
      onConfirm={() => {
        setToClose(false);
        setToUpdate(null);
        setToCreate(false);
      }}
      onCancel={() => setToClose(false)}
    />

    <DetailsDialog
      open={!!detailsOpen}
      data={{type:"expense_group", item: detailsOpen}}
      onClose={()=>{
        setDetailsOpen(null);
      }}
      onEdit={() => {
        setToUpdate(detailsOpen);
        setDetailsOpen(null);
      }}
      onDelete={() => {
        setToDelete(detailsOpen);
        setDetailsOpen(null);
      }}
    />
  </>
);
}
