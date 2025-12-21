import { Alert, Box, Button, CircularProgress, IconButton, Pagination, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import { useExpenses } from "../hooks/expenses/useExpenses";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { useEffect, useState } from "react";
import { useDeleteExpense } from "../hooks/expenses/useDeleteExpense";
import { Table, type Column } from "../components/ui/Table";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Expense } from "../types/expenses.responses";
import { ExpenseDialog } from "../components/expenses/ExpenseDialog";
import type { ExpenseQuery } from "../types/expenses.requests";
import { ExpensesFiltersDialog } from "../components/filters/expenses/ExpensesFiltersDialog";
import FilterIcon from '@mui/icons-material/FilterAlt';
import { RowLimitSelect } from "../components/ui/RowLimitSelect";
import { ActiveExpenseFilters } from "../components/filters/expenses/ActiveExpenseFilters";
import { useExpenseGroups } from "../hooks/expense-groups/useExpenseGroups";
import { MobileTransactionTable } from "../components/mobile/MobileTransactionTable";

export default function ExpensesPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [query, setQuery] = useState<ExpenseQuery>({
    page:1,
    limit: 10
  })

  const {data, isError, isLoading} = useExpenses(query);
  const deleteExpense = useDeleteExpense();

  const groupsData = useExpenseGroups({}).data;
  const groups = groupsData?.data ?? [];
  const groupNameById: Record<number, string> = {};
  for (const g of groups) {
    groupNameById[g.id] = g.name;
  }

  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<Expense | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);
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

  if(isError) return <Alert severity="error">Failed to load expenses.</Alert>
  
  const columns: Column<Expense>[] = [
    {
      key: "description",
      header: "Description",
      render: expense => expense.description,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: expense => formatEuros(expense.amount),
    },
    {
      key: "date",
      header: "Date",
      render: expense =>
        new Date(expense.createdAt).toLocaleDateString(),
    },
    {
      key: "group",
      header: "Group",
      render: expense => expense.groupName,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: expense => (
        <>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToUpdate(expense);
            }}
          >
            <EditIcon color="primary" fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToDelete(expense);
            }}
          >
            <DeleteIcon color="error" fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return(
    <>
      <Box
        sx={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          mb: 2,
        }}
      > 

        <Typography variant="h5">
          Expenses
        </Typography>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{height: 40}}
        >
          <strong>Add Expense</strong>
        </Button>
      </Box>

      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        gap: 1,
        mb: 2
      }}>
          <TextField
            size="small"
            label="Search"
            color="primary"              
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ 
              height: 40,
              minWidth: isMobile ? 200 : 450,
            }}
          />
          <Box 
            sx={{
              display: "flex",
              gap: "10px"
            }}
          >
            <Button 
              variant="outlined"
              color="primary"
              onClick={()=>setToFilter(true)}
              sx={{height: 40}}
            >
              <FilterIcon fontSize="small"/>
            </Button>

            <RowLimitSelect value={query.limit} onChange={(limit)=>setQuery(prev => ({...prev,limit,page:1}))}/>
        </Box>
      </Box>
      <Paper sx={{ p:2 }}>
        <ActiveExpenseFilters groups={groupNameById} query={query} onChange={setQuery}/>

        {
          //DESKTOP TABLE
          !isMobile && (
            <Table
              rows={data?.data ?? []}
              columns={columns}
              getRowKey={income => income.id}
            />
          )
        }

        {
          //MOBILE TABLE
          isMobile && (
            <MobileTransactionTable
              data={data?.data}
              onDelete={setToDelete}
              onEdit={setToUpdate}
              color="error"
            />
          )
        }

      </Paper>

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

      <ExpensesFiltersDialog 
        query={query}
        open={toFilter}
        onClose={()=>setToFilter(false)}
        onApply={(filters)=>{
          setQuery((prev)=>({
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
        onCancel={()=>setToDelete(null)}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteExpense.mutate(toDelete.id);
          setToDelete(null);
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
