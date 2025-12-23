import { Alert, Box, Button, CircularProgress, IconButton, Pagination, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
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
import { MobileIncomeGroupTable } from "../components/mobile/MobileIncomeGroupTable";
import { EmptyState } from "../components/ui/EmptyState";

export default function IncomeGroupsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");

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

  const isEmpty = data?.data.length === 0;

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
      align:"center",
      render: (gr) => (
        <>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              setToUpdate(gr)
            }}
          >
            <EditIcon color="primary" fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              setToDelete(gr)
            }}
          >
            <DeleteIcon color="error" fontSize="small" />
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

        <Typography variant={isMobile ? "h6" : "h5"}>
          Income Groups
        </Typography>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{ height: 40,
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            lineHeight: "1.3"
           }}
        >
          <strong>Add Group</strong>
        </Button>
      </Box>

      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        flexDirection: isMobile ? "column" : "row",
        gap: "10px",
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
              minWidth: isMobile ? null : 450,
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent:"right"
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
        {
          //DESKTOP TABLE
          !isMobile && (
            isEmpty ? 
            (
              <EmptyState name="income groups"/>
            ) 
            :   
            (
              <Table
                rows={data.data}
                columns={columns}
                getRowKey={gr => gr.id}
              />
            )
          )
        }

        {
          //MOBILE TABLE
          isMobile && (
            isEmpty ?
            (
              <EmptyState name="income groups"/>
            )
            :
            (
              <MobileIncomeGroupTable
                data={data.data}
                onDelete={setToDelete}
                onEdit={setToUpdate}
              />
            )
          )
        }
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
        hideNextButton={isEmpty}
        hidePrevButton={isEmpty}
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