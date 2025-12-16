import { Alert, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useExpenseGroups } from "../hooks/useExpenseGroups";
import { GenericTable, type Column } from "../components/GenericTable";
import type { ExpenseGroup } from "../types/expenseGroup";
import { useState } from "react";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete"
import { useDeleteExpenseGroup } from "../hooks/useDeleteExpenseGroup";
import formatMoney from "../utils/formatMoney"; 

export default function ExpenseGroupsPage() {
  const {data, isError, isLoading} = useExpenseGroups();
  const deleteExpenseGroup = useDeleteExpenseGroup();

  const [toDelete, setToDelete] = useState<ExpenseGroup | null>(null)


  if(isError) return <Alert severity="error">Failed to load expense groups.</Alert>
  if(isLoading) return <CircularProgress />

  const groupColumns: Column<ExpenseGroup>[] = [
    {
      key:"name",
      header:"Name",
      render: gr => gr.name
    },
    {
      key:"description",
      header:"Description",
      render: gr => (
        <Typography variant="body2" color="text.secondary">
          {gr.description}
        </Typography>
      )
    },
    {
      key:"budget-cap",
      header:"Budget Cap",
      align: "right",
      render: gr => gr.budgetCap ? formatMoney(gr.budgetCap) : "-"
    },
    {
      key:"actions",
      header:"Actions",
      render: gr => (
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            setToDelete(gr);
          }}
        >
          <DeleteIcon fontSize="small"/>
        </IconButton>
      )
    }
  ];

  return(
    <>
      <Typography variant="h5" sx={{mb:2}}>
        Expense Groups
      </Typography>
      <Paper sx={{p:2}}>
        <GenericTable 
          rows={data?.data ?? []}
          columns={groupColumns}
          getRowKey={gr => gr.id}
        />
      </Paper>
      <DeleteConfirmDialog
        open={!!toDelete}
        title="Delete expense group"
        onCancel={()=>setToDelete(null)}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteExpenseGroup.mutate(toDelete.id);
          setToDelete(null);
        }}
      />
    </>
  )
 }