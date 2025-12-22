import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useExpenseGroups } from "../hooks/expense-groups/useExpenseGroups";
import { type Column } from "../components/ui/Table";
import { Table } from "../components/ui/Table";
import type { ExpenseGroup } from "../types/expenseGroup.responses";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useDeleteExpenseGroup } from "../hooks/expense-groups/useDeleteExpenseGroups";
import { ExpenseGroupDialog } from "../components/expense-groups/ExpenseGroupDialog";
import type { ExpenseGroupQuery } from "../types/expenseGroup.requests";
import { ExpenseGroupsFiltersDialog } from "../components/filters/expense-groups/ExpenseGroupsFiltersDialog";
import FilterIcon from "@mui/icons-material/FilterAlt";
import { RowLimitSelect } from "../components/ui/RowLimitSelect";
import { ActiveExpenseGroupsFilters } from "../components/filters/expense-groups/ActiveExpenseGroupsFilters";
import { MobileExpenseGroupTable } from "../components/mobile/MobileExpenseGroupTable";
import formatEuros from "../utils/formatMoney";

export default function ExpenseGroupsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)")

  const [query, setQuery] = useState<ExpenseGroupQuery>({
    page: 1,
    limit: 10,
  });

  const { data, isError, isPending } = useExpenseGroups(query);

  const deleteExpenseGroup = useDeleteExpenseGroup();
  const [toDelete, setToDelete] = useState<ExpenseGroup | null>(null);
  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<ExpenseGroup | null>(null);
  const [toFilter, setToFilter] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(prev => ({
        ...prev,
        search: searchText,
        page: 1,
      }));
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    if (searchText !== "" && !query.search) {
      setSearchText("");
    }
  }, [query.search]);

  if (isError)
    return (
      <Alert severity="error">
        There has been an error loading expense groups
      </Alert>
    );

  if (isPending) return <CircularProgress />;

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
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              setToUpdate(gr)
            }}
          >
            <EditIcon color="primary" fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              setToDelete(gr)
            }}
          >
            <DeleteIcon color="error" fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"}>Expense Groups</Typography>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{ height: 40,
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            lineHeight: "1.3"
           }}
        >
          <strong>Add Group</strong>
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: 1,
          mb: 2,
        }}
      >
        <TextField
          size="small"
          label="Search"
          color="primary"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          sx={{
            height: 40,
            minWidth: isMobile ? null : 450,
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent:"right"
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >
            <FilterIcon fontSize="small" />
          </Button>

          <RowLimitSelect
            value={query.limit!}
            onChange={limit =>
              setQuery(prev => ({
                ...prev,
                limit,
                page: 1,
              }))
            }
          />
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <ActiveExpenseGroupsFilters
          query={query}
          onChange={setQuery}
        />
{
          // DESKTOP TABLE 
        }
        {!isMobile && (
            <Table 
              rows={data?.data ?? []}
              columns={columns}
              getRowKey={gr => gr.id}
            />
          )
        }
        {
          // MOBILE TABLE 
        }
        {
          isMobile && (
            <MobileExpenseGroupTable
              data={data?.data}
              onDelete={setToDelete}
              onEdit={setToUpdate}
            />
          )
        }
      </Paper>

      <ExpenseGroupsFiltersDialog
        open={toFilter}
        query={query}
        onClose={() => setToFilter(false)}
        onApply={filters => {
          setQuery(prev => ({
            ...prev,
            ...filters,
            page: 1,
          }));
        }}
      />

      <Pagination
        shape="rounded"
        color="primary"
        sx={{
          display:"flex",
          justifyContent:"center",
          mr: 2,
          mt: 2
        }}
        count={data?.totalPages}
        onChange={(_,value)=>setQuery((prev) => ({...prev, page:value}))}
      />
      
      <ConfirmDialog
        title="Delete Expense Group"
        action="Delete"
        description={`Are you sure you want to delete the "${toDelete?.name}" group?`}
        open={!!toDelete}
        onConfirm={() => {
          if (!toDelete) return;
          deleteExpenseGroup.mutate(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />

      <ExpenseGroupDialog
        open={toCreate}
        onClose={() => setToCreate(false)}
      />

      <ExpenseGroupDialog
        open={!!toUpdate}
        onClose={() => setToUpdate(null)}
        group={toUpdate}
      />
    </>
  );
}
