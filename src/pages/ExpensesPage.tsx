import { Alert, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useExpenses } from "../hooks/useExpenses";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useState } from "react";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import type { Transaction } from "../types/transaction";
import { GenericTable } from "../components/GenericTable";
import type { Column } from "../components/GenericTable";
import DeleteIcon from "@mui/icons-material/Delete"
import formatMoney from "../utils/formatMoney";

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
      render: tx => formatMoney(tx.amount),
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
        <GenericTable
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={tx => tx.id}
        />
      </Paper>
      <DeleteConfirmDialog 
        open={!!toDelete}
        title="Delete expense"
        description={toDelete?.description}
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