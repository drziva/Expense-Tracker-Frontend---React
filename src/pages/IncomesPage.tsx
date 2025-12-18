import { Alert, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useIncomes } from "../hooks/incomes/useIncomes";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import { useState } from "react";
import { useDeleteIncome } from "../hooks/incomes/useDeleteIncome";
import { Table, type Column } from "../components/ui/Table";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Income } from "../types/incomes.requests";
import type { Expense } from "../types/expenses.requests";

export default function IncomesPage() {
  const {data, isError, isLoading} = useIncomes();

  const [toDelete, setToDelete] = useState<Expense | Income | null>(null);

  const deleteIncome = useDeleteIncome();

  if(isLoading) return <CircularProgress />

  if(isError) return <Alert severity="error">Failed to load incomes.</Alert>

  const columns: Column<Expense | Income>[] = [
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

  return(
    <>
      <Typography variant="h5" sx={{mb:2}}>
        Incomes
      </Typography>

      <Paper sx={{ p:2 }}>
        <Table
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={tx => tx.id}
        />
      </Paper>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete income"
        action="Delete"
        description={`Are you sure you want to delete ${toDelete?.description}`}
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