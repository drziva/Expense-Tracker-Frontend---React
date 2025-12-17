import { Alert, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useExpenses } from "../hooks/expenses/useExpenses";
import { useDeleteExpense } from "../hooks/expenses/useDeleteExpense";
import { useState } from "react";
import type { Transaction } from "../types/transaction";
import { Table } from "../components/ui/Table";
import type { Column } from "../components/ui/Table";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function ExpensesPage() { 
  const {data, isLoading, isError} = useExpenses();

  const [ toDelete, setToDelete ] = useState<Transaction | null>(null);

  const deleteExpense = useDeleteExpense();

  if(isLoading) return <CircularProgress/>;

  if(isError) return <Alert severity="error">Failed to load expenses.</Alert>;

  const columns: Column<Transaction>[] = [
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
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            setToDelete(tx);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Typography variant="h5" sx={{mb:2, color: "text.primary"}}>
        Expenses
      </Typography>

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
        description={`Are you sure you want to delete ${toDelete?.description}`}
        loading={deleteExpense.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteExpense.mutate(toDelete.id);
          setToDelete(null)
        }}
      />
    </>
  );
}