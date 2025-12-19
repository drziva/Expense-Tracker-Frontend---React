import { Alert, Box, Button, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useExpenses } from "../hooks/expenses/useExpenses";
import { useDeleteExpense } from "../hooks/expenses/useDeleteExpense";
import { useState } from "react";
import { Table } from "../components/ui/Table";
import type { Column } from "../components/ui/Table";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from '@mui/icons-material/Edit';
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { ExpenseDialog } from "../components/expenses/ExpenseDialog";
import type { Expense } from "../types/expenses.responses";

export default function ExpensesPage() { 
  const {data, isLoading, isError} = useExpenses();

  const deleteExpense = useDeleteExpense();
  const [ toDelete, setToDelete ] = useState<Expense | null>(null);
  const [toCreate, setToCreate] = useState(false)
  const [toUpdate, setToUpdate] = useState<Expense | null>(null);

  if(isLoading) return <CircularProgress/>;
  if(isError) return <Alert severity="error">Failed to load expenses.</Alert>;

  const columns: Column<Expense>[] = [
    {
      key: "description",
      header: "Description",
      render: tx => tx.description,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: tx => formatEuros(tx.amount),
    },
    {
      key: "date",
      header: "Date",
      render: tx =>
        new Date(tx.createdAt).toLocaleDateString(),
    },
    {
      key: "group",
      header: "Group",
      render: tx => tx.groupName,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: tx => (
        <>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToDelete(tx);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToUpdate(tx);
            }}
          >
          <EditIcon fontSize="small" />
        </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display:"flex",
          justifyContent:"space-between",
          gap:"10px",
          mb: 1
        }}
      >      
        <Typography variant="h5">
          Expenses
        </Typography>
        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
        >
          <strong>Add Expense</strong>
        </Button>
      </Box>
      <Paper sx={{ p:2 }} >
        <Table
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={tx => tx.id}
        />
      </Paper>

      <ConfirmDialog 
        open={!!toDelete}
        title="Delete expense"
        action="Delete"
        description={`Are you sure you want to delete "${toDelete?.description}"?`}
        loading={deleteExpense.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteExpense.mutate(toDelete.id);
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
  );
}