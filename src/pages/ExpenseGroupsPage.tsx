import { Alert, Box, Button, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useExpenseGroups } from "../hooks/expense-groups/useExpenseGroups";
import { Table, type Column } from "../components/ui/Table";
import type { ExpenseGroup } from "../types/expenseGroup.responses";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from '@mui/icons-material/Edit';
import { useDeleteExpenseGroup } from "../hooks/expense-groups/useDeleteExpenseGroups";
import formatEuros from "../utils/formatMoney";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { ExpenseGroupDialog } from "../components/expense-groups/ExpenseGroupDialog";

export default function ExpenseGroupsPage() {
  const {data, isError, isLoading} = useExpenseGroups();

  const [toDelete, setToDelete] = useState<ExpenseGroup | null>(null)
  const deleteExpenseGroup = useDeleteExpenseGroup();

  const [toUpdate, setToUpdate] = useState<ExpenseGroup | null>(null)

  const [toCreate, setToCreate] = useState(false);

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
        <>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToDelete(gr);
            }}
          >
            <DeleteIcon fontSize="small"/>
          </IconButton>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToUpdate(gr)
            }}
          >
            <EditIcon fontSize="small"/>
          </IconButton>          
        </>
      )
    }
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
          Expense Groups
        </Typography>
        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
        >
          <strong>Add Expense Group</strong>
        </Button>
      </Box>
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
      <ExpenseGroupDialog 
        open={toCreate}
        onClose={() => setToCreate(false)}
      />

      <ExpenseGroupDialog 
        open={!!toUpdate}
        onClose={()=> setToUpdate(null)}
        group={toUpdate}
      />
    </>
  )
 }