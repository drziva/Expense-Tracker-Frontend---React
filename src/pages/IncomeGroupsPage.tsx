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
import { useSearchParams } from "react-router-dom";
import type { GroupSortOption } from "../types/pagination";
import SearchBox from "../components/common/SearchBox";
import { useIncomeTotalByGroup } from "../hooks/income-groups/useIncomeTotalByGroup";
import { GroupBarChart } from "../components/common/charts/GroupBarChart";
import { Tooltip } from "@mui/material";

export default function IncomeGroupsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const sortParam = searchParams.get("sort") ?? undefined;
  const sort: GroupSortOption | undefined = 
    sortParam === "date_desc" || 
    sortParam === "date_asc" ||
    sortParam === "name_desc" || 
    sortParam === "name_asc"
      ? sortParam
      : undefined;
  const search = searchParams.get("search") ?? undefined;
  const limit = Number(searchParams.get("limit")) === 0 ? 10 : Number(searchParams.get("limit"));
  const page = Number(searchParams.get("page")) ?? 1; 
  const [query, setQuery] = useState<IncomeGroupQuery>({
    page,
    limit,
    from,
    to,
    search
  })
  const { data, isError, isPending } = useIncomeGroups(query);
  const {data: summaryData} = useIncomeTotalByGroup({ from: query.from, to: query.to });

  const deleteIncomeGroup = useDeleteIncomeGroup();
  const [toDelete, setToDelete] = useState<IncomeGroup | null>(null);
  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<IncomeGroup | null>(null)
  const [toFilter, setToFilter] = useState(false);

  useEffect(()=>{
    setQuery(prev=>({
      ...prev,
      search,
      from,
      to,
      sort,
      limit,
      page
    }))
  },[searchParams])

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
          <Tooltip
            title="Edit"
          >
            <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation()
              setToUpdate(gr)
            }}
            >
              <EditIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip 
              title="Delete"
            >
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation()
                  setToDelete(gr)
                }}
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ]

  return (
    <>
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2
        }}
      >
        <Box>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            fontWeight={600}
          >
            Income Groups
          </Typography>

         {!isMobile && (
           <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{
              mt: 1,
              ml: 2
            }}
          >
            {query.from && query.to
              ? `Income summary by group from ${query.from} to ${query.to}`
              : query.from
              ? `Income summary by group from ${query.from} until now`
              : query.to
              ? `Income summary by group until ${query.to}`
              : "Income summary by group for the last 30 days"}
          </Typography>)}
        </Box>
      </Box>

      {/* CHART */}

      {!isMobile && summaryData && summaryData.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.paper"
            }}
          >
            <GroupBarChart data={summaryData} />
          </Box>
        </Box>
      )}

      {/* SEARCH + FILTERS */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: "10px",
          mb: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "2px",
            justifyContent: isMobile ? "center" : "left"
          }}
        >
          <SearchBox />

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >
            <FilterIcon fontSize="small" />
          </Button>

          <RowLimitSelect />
        </Box>

        <Button
          onClick={() => setToCreate(true)}
          variant="contained"
          sx={{
            height: 40,
            fontSize: "0.8rem",
            lineHeight: "1.3"
          }}
        >
          <strong>Add Group</strong>
        </Button>
      </Box>

      {/* TABLE */}

      <Paper sx={{ p: 2 }}>
        <ActiveIncomeGroupsFilters />

        {!isMobile && (
          isEmpty
            ? <EmptyState name="income groups" />
            : (
              <Table
                rows={data.data}
                columns={columns}
                getRowKey={(gr) => gr.id}
              />
            )
        )}

        {isMobile && (
          isEmpty
            ? <EmptyState name="income groups" />
            : (
              <MobileIncomeGroupTable
                data={data.data}
                onDelete={setToDelete}
                onEdit={setToUpdate}
              />
            )
        )}
      </Paper>

      {/* PAGINATION */}

      <Pagination
        shape="rounded"
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          mr: 2,
          mt: 2
        }}
        count={data?.totalPages}
        onChange={(_, value) =>
          setQuery((prev) => ({
            ...prev,
            page: value
          }))
        }
        hideNextButton={isEmpty}
        hidePrevButton={isEmpty}
      />

      {/* DIALOGS */}

      <IncomeGroupsFiltersDialog
        open={toFilter}
        onClose={() => setToFilter(false)}
      />

      <ConfirmDialog
        title="Delete Income Group"
        action="Delete"
        description={`Are you sure you want to delete the "${toDelete?.name}" group?`}
        open={!!toDelete}
        onConfirm={() => {
          if (!toDelete) return
          deleteIncomeGroup.mutate(toDelete.id)
          setToDelete(null)
        }}
        onCancel={() => setToDelete(null)}
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