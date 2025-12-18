import type z from "zod";
import type { IncomeGroup } from "../../types/incomeGroup.responses";
import { incomeGroupSchema } from "../../schemas/income-group.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateIncomeGroup } from "../../hooks/income-groups/useCreateIncomeGroups";
import { useUpdateIncomeGroup } from "../../hooks/income-groups/useUpdateIncomeGroups";
import { useEffect } from "react";
import { IncomeGroupForm } from "./form/IncomeGroupForm";
import { FormDialog } from "../ui/FormDialog";
import { Alert } from "@mui/material";

type FormInput = z.input<typeof incomeGroupSchema>
type FormOutput = z.infer<typeof incomeGroupSchema>

type Props = {
  open: boolean;
  onClose: () => void
  group?: IncomeGroup | null
}

export function IncomeGroupDialog({open, onClose, group}: Props) {
  const createIncomeGroup = useCreateIncomeGroup();
  const updateIncomeGroup = useUpdateIncomeGroup();

  const isUpdate = !!group;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(incomeGroupSchema),
    defaultValues:{
      name: "",
      description: ""
    }
  })

  useEffect(()=>{
    if(!open){
      form.reset();
      createIncomeGroup.reset();
      updateIncomeGroup.reset();
    }
    if(isUpdate) {
      form.reset({
        name: group.name,
        description: group.description
      })
    }
  },[open, group])

  async function onSubmit(data: FormOutput) {
    try{
      if(!isUpdate) {
        await createIncomeGroup.mutateAsync(data);
      }else {
        await updateIncomeGroup.mutateAsync({
          id: group.id,
          req: data
        })
      }
      onClose();
    } catch(error) {}
  }

  const rawError = isUpdate 
    ? updateIncomeGroup.error?.response?.data.message
    : createIncomeGroup.error?.response?.data.message;
    
  const error = Array.isArray(rawError) ? rawError[0] : rawError; 

  return(
    <FormDialog
      open={open}
      action={isUpdate ? "Update" : "Create"}
      submitting={isUpdate ? updateIncomeGroup.isPending : createIncomeGroup.isPending}
      title={isUpdate ? "Update Income Group" : "Create Income Group"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {
        error && 
        <Alert severity="error">{error}</Alert>
      }
      <IncomeGroupForm form={form} />
    </FormDialog>
  )
}