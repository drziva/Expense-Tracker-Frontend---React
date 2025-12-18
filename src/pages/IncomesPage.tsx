import { Alert, Box, Button, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useIncomes } from "../hooks/incomes/useIncomes";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { useState } from "react";
import { useDeleteIncome } from "../hooks/incomes/useDeleteIncome";
import { Table, type Column } from "../components/ui/Table";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Income } from "../types/incomes.requests";
import { IncomeDialog } from "../components/incomes/IncomeDialog";

export default function IncomesPage() {
  const {data, isError, isLoading} = useIncomes();
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
          mb: 1
        }}
      >      
        <Typography variant="h5">
          Incomes
        </Typography>
        <Button
          onClick={() => setToCreate(true)}
          variant="outlined"
        >
          <strong>Add Income</strong>
        </Button>
      </Box>

      <Paper sx={{ p:2 }}>
        <Table
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={income => income.id}
        />
      </Paper>

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