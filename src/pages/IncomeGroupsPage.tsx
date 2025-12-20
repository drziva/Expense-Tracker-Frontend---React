import { Alert, Box, Button, CircularProgress, IconButton, Pagination, Paper, TextField, Typography } from "@mui/material";
import { useIncomeGroups } from "../hooks/income-groups/useIncomeGroups";
import { type Column } from "../components/ui/Table";
import { Table } from "../components/ui/Table"
import type { IncomeGroup } from "../types/incomeGroup.responses";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useDeleteIncomeGroup } from "../hooks/income-groups/useDeleteIncomeGroups";
import { IncomeGroupDialog } from "../components/income-groups/IncomeGroupDialog";
import type { IncomeGroupQuery } from "../types/incomeGroup.requests";
import { IncomeGroupsFiltersDialog } from "../components/filters/income-groups/IncomeGroupsFiltersDialog";
import FilterIcon from '@mui/icons-material/FilterAlt';
import { RowLimitSelect } from "../components/ui/RowLimitSelect";
import { ActiveIncomeGroupsFilters } from "../components/filters/income-groups/ActiveIncomeGroupsFilters";

export default function IncomeGroupsPage() {
  const [query, setQuery] = useState<IncomeGroupQuery>({
    page:1,
    limit:10
  })

  const { data, isError, isPending } = useIncomeGroups(query);

  const deleteIncomeGroup = useDeleteIncomeGroup();
  const [toDelete, setToDelete] = useState<IncomeGroup | null>(null);
  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<IncomeGroup | null>(null)
  const [toFilter, setToFilter] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setQuery(prev => ({
        ...prev,
        search: searchText,
        page:1
      }))
    },350)
    return() => clearTimeout(timeout);
  },[searchText])

  useEffect(()=>{
    if(searchText !== "" && !query.search)
    {
      setSearchText("")
    }
  },[query.search])

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
          justifyContent:"space-between",
          alignItems:"center",
          mb: 2,
        }}
      > 

        <Typography variant="h5">
          Income Groups
        </Typography>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{height: 40}}
        >
          <strong>Add Income</strong>
        </Button>
      </Box>

      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        mb: 2
      }}>
          <TextField
            size="small"
            label="Search"
            color="primary"              
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ 
              height: 40,
              minWidth: 450,
            }}
          />
          <Box 
            sx={{
              display: "flex",
              gap: "10px"
            }}
          >
            <Button 
              variant="outlined"
              color="primary"
              onClick={()=>setToFilter(true)}
              sx={{height: 40}}
            >
              <FilterIcon fontSize="small"/>
            </Button>

            <RowLimitSelect value={query.limit!} onChange={(limit)=>setQuery(prev => ({...prev,limit,page:1}))}/>
        </Box>
      </Box>
      
      <Paper sx={{p:2}}>
        <ActiveIncomeGroupsFilters
          query={query}
          onChange={setQuery}
        />
        <Table 
          rows={data?.data ?? []}
          columns={columns}
          getRowKey={gr => gr.id}
        />
      </Paper>

      <IncomeGroupsFiltersDialog
        open={toFilter}
        query={query}
        onClose={()=> setToFilter(false)}
        onApply={(filters) => {
          setQuery(prev => ({
            ...prev,
            ...filters,
            page:1
          }))
        }}
      />

      <Pagination
        shape="rounded"
        color="primary"
        sx={{
          display:"flex",
          justifyContent:"center",
          mr: 2,
          mt: 2
        }}
        count={data?.totalPages}
        onChange={(_,value)=>setQuery((prev) => ({...prev, page:value}))}
      />

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