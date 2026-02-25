import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useExpenseGroups } from "../hooks/expense-groups/useExpenseGroups";
import { type Column } from "../components/ui/Table";
import { Table } from "../components/ui/Table";
import type { ExpenseGroup } from "../types/expenseGroup.responses";
import { useActionState, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useDeleteExpenseGroup } from "../hooks/expense-groups/useDeleteExpenseGroups";
import { ExpenseGroupDialog } from "../components/expense-groups/ExpenseGroupDialog";
import type { ExpenseGroupQuery } from "../types/expenseGroup.requests";
import { ExpenseGroupsFiltersDialog } from "../components/filters/expense-groups/ExpenseGroupsFiltersDialog";
import FilterIcon from "@mui/icons-material/FilterAlt";
import { RowLimitSelect } from "../components/ui/RowLimitSelect";
import { ActiveExpenseGroupsFilters } from "../components/filters/expense-groups/ActiveExpenseGroupsFilters";
import { MobileExpenseGroupTable } from "../components/mobile/MobileExpenseGroupTable";
import formatEuros from "../utils/formatMoney";
import { EmptyState } from "../components/ui/EmptyState";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import type { GroupSortOption } from "../types/pagination";
import SearchBox from "../components/common/SearchBox";
import z from "zod";

export default function ExpenseGroupsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const deleteExpenseGroup = useDeleteExpenseGroup();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toDelete, setToDelete] = useState<ExpenseGroup | null>(null);
  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<ExpenseGroup | null>(null);
  const [toFilter, setToFilter] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TEMP - NATIVE ACTION FORM - So much worse than RHF

  const validationSchema = z.object({
    email: z.email("Field must contain a valid email"),
    password: z.string().min(8, "Password must be 8 characters or longer."),

    number: z.coerce.number("Field must include a valid number."),

    //step2
    email2: z.email("Field must contain a valid email"),
    password2: z.string().min(8, "Password must be 8 characters or longer."),
  });

  type FormInput = z.input<typeof validationSchema>;
  type FormOutput = z.output<typeof validationSchema>;

  type State = {
    ok: boolean,
    errors: Partial<Record<keyof FormOutput, string>>,
    values: Partial<Record<keyof FormOutput, string>>,
  };

  const initialState: State = {ok: false, errors: {}, values: {}}

  const action = async(_prev: State, fd: FormData): Promise<State> => {
    const raw = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
      number: String(fd.get("number") ?? ""),
    };

    const parsed = validationSchema.safeParse(raw);

    if(!parsed.success) {
      const errors: State["errors"] = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormOutput;
        errors[key] = issue.message;
      }
      return {ok: false, errors, values: raw};
    }

    const data: FormOutput = parsed.data;
    console.log("SUBMIT: ", data);
    
    return {ok:true, errors: {}, values: {}};
  }

  const [state, formAction] = useActionState(action, initialState);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const fromParam = searchParams.get("from");
  const from = 
    fromParam && 
    dayjs(fromParam,"YYYY-MM-DD",true).isValid()
    ? fromParam 
    : undefined;
  const toParam = searchParams.get("to");
  const to = 
    toParam && 
    dayjs(toParam,"YYYY-MM-DD",true).isValid()
    ? toParam 
    : undefined;  

  const sortParam = searchParams.get("sort");
  const sort: GroupSortOption | undefined = 
    sortParam === "date_asc" ||
    sortParam === "date_desc" ||
    sortParam === "name_asc" ||
    sortParam === "name_desc"
    ? sortParam 
    : undefined;
  
  const search = searchParams.get("search") ?? undefined;
  const limit = Number(searchParams.get("limit")) === 0 ? 10 : Number(searchParams.get("limit"));
  const page = Number(searchParams.get("page")) ?? 1;

  const [query, setQuery] = useState<ExpenseGroupQuery>({
    page,
    limit,
    search,
    from,
    to,
    sort
  });
  
  const { data, isError, isPending } = useExpenseGroups(query);

  useEffect(() => {
    setQuery(prev => ({
      ...prev,
      from,
      to,
      sort,
      search,
      limit,
      page
    }))
  },[searchParams])

  if (isError)
    return (
      <Alert severity="error">
        There has been an error loading expense groups
      </Alert>
    );

  if (isPending) return <CircularProgress />;

  const isEmpty = data?.data.length === 0;

  const columns: Column<ExpenseGroup>[] = [
    {
      key: "name",
      header: "Name",
      render: group => group.name,
    },
    {
      key: "description",
      header: "Description",
      render: group => (
        <Typography variant="body2" color="text.secondary">
          {group.description}
        </Typography>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: group =>
        new Date(group.createdAt).toLocaleDateString(),
    },
    {
      key: "budget-cap",
      header: "Budget Cap",
      render: group => (
        group.budgetCap ? formatEuros(group.budgetCap) : "-"
      )
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: gr => (
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
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"}>Expense Groups</Typography>

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: 1,
          mb: 2,
        }}
      >
       <SearchBox/>

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
            onClick={() => setToFilter(true)}
            sx={{ height: 40 }}
          >
            <FilterIcon fontSize="small" />
          </Button>

          <RowLimitSelect/>
          
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <ActiveExpenseGroupsFilters
        />
        {
          //DESKTOP TABLE
          !isMobile && (
            isEmpty ? 
            (
              <EmptyState name="expense groups"/>
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
              <EmptyState name="expense groups"/>
            )
            :
            (
              <MobileExpenseGroupTable
                data={data.data}
                onDelete={setToDelete}
                onEdit={setToUpdate}
              />
            )
          )
        }
      </Paper>

      <ExpenseGroupsFiltersDialog
        open={toFilter}
        onClose={() => setToFilter(false)}
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
        title="Delete Expense Group"
        action="Delete"
        description={`Are you sure you want to delete the "${toDelete?.name}" group?`}
        open={!!toDelete}
        onConfirm={() => {
          if (!toDelete) return;
          deleteExpenseGroup.mutate(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />

      <ExpenseGroupDialog
        open={toCreate}
        onClose={() => setToCreate(false)}
      />

      <ExpenseGroupDialog
        open={!!toUpdate}
        onClose={() => setToUpdate(null)}
        group={toUpdate}
      />
      {
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////


        <form action={formAction}>
          <input name="email" type="email"></input>
          <input name="password" type="password"></input>
          <input name="number"></input>
          <input name="email2" type="email"></input>
          <input name="password2" type="password"></input>
          <button>Send</button>
        </form>

        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
      }
    </>
  );
}
