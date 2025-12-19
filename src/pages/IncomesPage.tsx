import { Alert, Box, Button, CircularProgress, IconButton, Pagination, Paper, TextField, Typography } from "@mui/material";
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
import type { IncomeQuery } from "../types/incomeGroup.requests";
import { IncomesFiltersDialog } from "../components/filters/incomes/IncomesFiltersDialog";
import FilterIcon from '@mui/icons-material/FilterAlt';
import { RowLimitSelect } from "../components/ui/RowLimitSelect";
import { ActiveIncomeFilters } from "../components/filters/incomes/ActiveIncomeFilters";
import { useIncomeGroups } from "../hooks/income-groups/useIncomeGroups";

export default function IncomesPage() {
  const [query, setQuery] = useState<IncomeQuery>({
    page:1,
    limit: 10
  })

  const {data, isError, isLoading} = useIncomes(query);
  const deleteIncome = useDeleteIncome();

  const groupsData = useIncomeGroups().data;
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
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToDelete(income);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToUpdate(income);
            }}
          >
            <EditIcon fontSize="small" />
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
          Incomes
        </Typography>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{height: 40}}
        >
          <strong>Add Income</strong>
        </Button>
      </Box>

      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
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
              minWidth: 450,
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
        <ActiveIncomeFilters groups={groupNameById} query={query} onChange={setQuery}/>
        <Table
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={income => income.id}
        />
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
        page={query.page}
        count={data?.totalPages}
        onChange={(_,value)=>setQuery((prev) => ({...prev, page:value}))}
      />

      <IncomesFiltersDialog 
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
        title="Delete income"
        action="Delete"
        description={`Are you sure you want to delete "${toDelete?.description}"`}
        loading={deleteIncome.isPending}
        onCancel={()=>setToDelete(null)}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteIncome.mutate(toDelete.id);
          setToDelete(null);
        }}
      />

      <IncomeDialog 
        open={toCreate}
        onClose={() => setToCreate(false)}
      />
      
      <IncomeDialog 
        open={!!toUpdate}
        onClose={() => setToUpdate(null)}
        income={toUpdate}
      />
    </>
  )
}