import { Alert, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useIncomes } from "../hooks/useIncomes";
import DeleteIcon from "@mui/icons-material/Delete"
import { useState } from "react";
import { useDeleteIncome } from "../hooks/useDeleteIncome";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import type { Transaction } from "../types/transaction";
import { GenericTable, type Column } from "../components/GenericTable";

export default function IncomesPage() {
  const {data, isError, isLoading} = useIncomes();

  const [toDelete, setToDelete] = useState<Transaction | null>(null);

  const deleteIncome = useDeleteIncome();

  if(isLoading) return <CircularProgress />

  if(isError) return <Alert severity="error">Failed to load incomes.</Alert>

  const columns: Column<Transaction>[] = [
    {
      key: "description",
      header: "Description",
      render: tx => tx.description,
    },
    {
      key: "amount",
      header: "Amount (€)",
      align: "right",
      render: tx => tx.amount.toFixed(2),
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

  return(
    <>
      <Typography variant="h5" sx={{mb:2}}>
        Incomes
      </Typography>

      <Paper sx={{ p:2 }}>
        <GenericTable
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={tx => tx.id}
        />
      </Paper>

      <DeleteConfirmDialog
        open={!!toDelete}
        title="Delete Income"
        description={toDelete?.description}
        loading={deleteIncome.isPending}
        onCancel={()=>setToDelete(null)}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteIncome.mutate(toDelete.id);
          setToDelete(null);
        }}
      />
    </>
  )
}