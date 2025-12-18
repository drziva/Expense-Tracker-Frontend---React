import { Alert, Box, Button, CircularProgress, FormControl, IconButton, InputLabel, Menu, MenuItem, Pagination, Paper, Select, TextField, Typography } from "@mui/material";
import { useIncomes } from "../hooks/incomes/useIncomes";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { useState } from "react";
import { useDeleteIncome } from "../hooks/incomes/useDeleteIncome";
import { Table, type Column } from "../components/ui/Table";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Income } from "../types/incomes.responses";
import { IncomeDialog } from "../components/incomes/IncomeDialog";
import type { IncomeQuery } from "../types/incomeGroup.requests";
import { IncomesFilters } from "../components/filters/IncomesFilters";

export default function IncomesPage() {
  const [query, setQuery] = useState<IncomeQuery>({
    page:1,
    limit: 10
  })

  const {data, isError, isLoading} = useIncomes(query);
   const deleteIncome = useDeleteIncome();

  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<Income | null>(null);
  const [toDelete, setToDelete] = useState<Income | null>(null);

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
          gap:"10px",
          justifyContent:"space-between",
          mb: 1
        }}
      >      
        <Typography variant="h5">
          Incomes
        </Typography>
        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
        >
          <strong>Add Income</strong>
        </Button>
      </Box>

      <Paper sx={{ p:2 }}>
        <IncomesFilters
          onApply={(filters)=>{
            setQuery(prev=>({
              ...prev,
              ...filters,
              page: 1
            }))
          }}
        />
        <Table
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={income => income.id}
        />
      </Paper>
      <Pagination
        shape="rounded"
        hideNextButton={query.page >= (data?.totalPages ?? 0)}
        hidePrevButton={query.page >= (data?.totalPages ?? 0)}
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