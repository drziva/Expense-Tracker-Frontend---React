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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function IncomeGroupsPage() {
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //TEMP - LEARNING

  const [step, setStep] = useState(0);

  const stepFields = [
    ["email", "password"],
    ["number"],
    ["email2", "password2"]
  ];

  const next = async() => {
    const fields = stepFields[step];
    const ok = await rhForm.trigger(fields as any, { shouldFocus: true});
    if(!ok) return;
    setStep((s) => s+1);
  };

  const back = () => setStep((s) => Math.max(0,s-1));

  const onFinalSubmit = (values: FormOutput) => {
    console.log("stepForm: ", values);
  }

  const validationSchema = z.object({
    email: z.email("Field must contain a valid email"),
    password: z.string().min(8, "Password must be 8 characters or longer."),

    number: z.coerce.number("Field must include a valid number."),

    //step2
    email2: z.email("Field must contain a valid email"),
    password2: z.string().min(8, "Password must be 8 characters or longer."),
  });

  type FormInput = z.input<typeof validationSchema>;
  type FormOutput = z.infer<typeof validationSchema>;

  const rhForm = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(validationSchema),
    mode: "onSubmit",
    shouldUnregister: false
  })

  const {
    register,
    formState: {errors, isValid, isSubmitting},
    handleSubmit
  } = rhForm

  const onSubmit = (formValues: FormOutput) => {
    setTimeout(() => {
      alert(`${formValues.email} + ${formValues.password} + Number: ${formValues.number} + ${formValues.email2}`)
    }, 300)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////
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
              onClick={()=>setToFilter(true)}
              sx={{height: 40}}
            >
              <FilterIcon fontSize="small"/>
            </Button>

            <RowLimitSelect/>
        </Box>
      </Box>
      
      <Paper sx={{p:2}}>
        {
        <ActiveIncomeGroupsFilters />
        }
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
        onClose={()=> setToFilter(false)}
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
      {
        /////////////////////////
        /// TEMP FORM - POC
      } 
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "300px",
            minHeight: "400px",
            gap: "10px"
          }}
        >
        {step === 0 &&<input
          type="email"
          placeholder="Email"
          {...register("email")}
        ></input>}
        {errors.email?.message}
        {step === 0 && <input
          type="password"
          placeholder="Password"
          {...register("password")}
        ></input>}
        {errors.password?.message}
        {step === 1 && <input
          placeholder="Number"
          {...register("number")}
        ></input>}
        {errors.number?.message}
        {step === 2 && <input
          type="email2"
          placeholder="Email"
          {...register("email2")}
        ></input>}
        {errors.email2?.message}
        {step === 2 &&<input
          type="password"
          placeholder="Password"
          {...register("password2")}
        ></input>}
        {errors.password2?.message}
        <button onClick={(e) => {
          e.preventDefault(); 
          back();
        }}>Back</button>
        {step < 2 && <button onClick={(e) => {
          e.preventDefault();
          next();
        }}>Next</button>}
        { step === 2 && <button type="submit">Send</button>}
        <div>{step}</div>
        </Box>
      </form>
      {
        ////////////////////////
      }
    </>
  )
}