import { Alert, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useExpenseGroups } from "../hooks/expense-groups/useExpenseGroups";
import { Table, type Column } from "../components/Table";
import type { ExpenseGroup } from "../types/expenseGroup.responses";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete"
import { useDeleteExpenseGroup } from "../hooks/expense-groups/useDeleteExpenseGroups";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ConfirmDialog";

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
      render: gr => gr.budgetCap ? formatEuros(gr.budgetCap) : "-"
    },
    {
      key:"actions",
      align:"center",
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
        <Table 
          rows={data?.data ?? []}
          columns={groupColumns}
          getRowKey={gr => gr.id}
        />
      </Paper>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete expense group"
        action="Delete"
        description={`Are you sure you want to delete the "${toDelete?.name}" group?`}
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