import { Alert, Box, Button, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useIncomeGroups } from "../hooks/income-groups/useIncomeGroups";
import { type Column } from "../components/ui/Table";
import { Table } from "../components/ui/Table"
import type { IncomeGroup } from "../types/incomeGroup.responses";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useDeleteIncomeGroup } from "../hooks/income-groups/useDeleteIncomeGroups";
import { IncomeGroupDialog } from "../components/income-groups/IncomeGroupDialog";

export default function IncomeGroupsPage() {
  const { data, isError, isPending } = useIncomeGroups();
  const deleteIncomeGroup = useDeleteIncomeGroup();
  const [toDelete, setToDelete] = useState<IncomeGroup | null>(null);
  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<IncomeGroup | null>(null)

  if(isError) return <Alert severity="error">There has been an error loading income groups</Alert>
  if(isPending) return <CircularProgress/>

  const columns: Column<IncomeGroup>[] = [
    {
      key:"name",
      header:"Name",
      render: group => group.name
    },
    {
      key:"description",
      header:"Description",
      render: group =>  (
        <Typography variant="body2" color="text.secondary">
          {group.description}
        </Typography>
      ),
    },
    {
      key:"date",
      header:"Date",
      render: group => new Date(group.createdAt).toLocaleDateString()
    },    
    {
      key:"actions",
      header:"Actions",
      render: (gr) => (
        <>
          <IconButton
            onClick={()=>setToDelete(gr)}
          >
            <DeleteIcon fontSize="small"/>
          </IconButton>
          <IconButton
            onClick={()=>setToUpdate(gr)}
          >
            <EditIcon fontSize="small"/>
          </IconButton>
        </>
      )
    }
  ]

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
          Income Groups
        </Typography>
        <Button
          onClick={() => {
            setToCreate(true);
          }}
          variant="contained"
        >
          <strong>Add Income Group</strong>
        </Button>
      </Box>
      <Paper sx={{p:2}}>
        <Table 
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={gr => gr.id}
        />
      </Paper>
      <ConfirmDialog
        title="Delete Income Group"
        action="Delete"
        description={`Are you sure you want to delete the "${toDelete?.name}" group?`}
        open={!!toDelete}
        onConfirm={()=>{
          if(!toDelete) return;
          deleteIncomeGroup.mutate(toDelete.id);
          setToDelete(null);
        }}
        onCancel={()=> setToDelete(null)}
      />

      <IncomeGroupDialog 
        open={toCreate}
        onClose={() => setToCreate(false)}
      />

      <IncomeGroupDialog 
        open={!!toUpdate}
        onClose={() => setToUpdate(null)}
        group={toUpdate}
      />
    </>
  )
}