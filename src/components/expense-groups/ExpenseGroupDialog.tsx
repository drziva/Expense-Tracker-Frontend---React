import { useCreateExpenseGroup } from "../../hooks/expense-groups/useCreateExpenseGroups";
import { FormDialog } from "../ui/FormDialog";
import { ExpenseGroupForm } from "./form/ExpenseGroupForm";
import type { ExpenseGroup } from "../../types/expenseGroup.responses";
import { useUpdateExpenseGroup } from "../../hooks/expense-groups/useUpdateExpenseGroups";
import { Alert } from "@mui/material";
import { expenseGroupSchema } from "../../schemas/expense-group.schema";
import type { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  group?: ExpenseGroup | null;
}

type FormInput = z.input<typeof expenseGroupSchema>
type FormOutput = z.infer<typeof expenseGroupSchema>

export function ExpenseGroupDialog({open, onClose, group}: Props) {
  const createExpenseGroup = useCreateExpenseGroup();
  const updateExpenseGroup = useUpdateExpenseGroup();

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(expenseGroupSchema),
    defaultValues:{
      name:"",
      description:"",
      budgetCap:""
    }
  })

  const { formState: {isDirty}} = form;

  const isUpdate = !!group;

  useEffect(() => {
    if(!open){
      form.reset();
      createExpenseGroup.reset();
      updateExpenseGroup.reset();
    }
    if(isUpdate && group) {
      form.reset({
        name: group.name,
        description: group?.description,
        budgetCap: group.budgetCap === undefined ? "" : String(group.budgetCap)
      })
    }
  }, [open, group])

  async function onSubmit(data: FormOutput) {
    if(isUpdate && !isDirty){
      onClose();
      return;
    }
    try{
      if(isUpdate && group) {
        await updateExpenseGroup.mutateAsync({
          id: group.id,
          req: data
        })
      }
      else if(!isUpdate){
        await createExpenseGroup.mutateAsync(data);
      }
      onClose();
    } catch(error) {}
  }

  const title = isUpdate ? 
    "Update Expense Group" :
    "Create Expense Group";

  const isSubmitting =
    isUpdate
      ? updateExpenseGroup.isPending
      : createExpenseGroup.isPending;

  const rawError = 
    isUpdate 
      ? updateExpenseGroup.error?.response?.data?.message
      : createExpenseGroup.error?.response?.data?.message

  const apiError = Array.isArray(rawError) ? rawError[0] : rawError
  
  return(
    <FormDialog
      open={open}
      title={title}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      submitting={isSubmitting}
    > 
      {
        apiError && 
        <Alert severity="error">
          {`The has been an error ${isUpdate ? "updating" : "creating"} the expense group` }
        </Alert>
      }
      <ExpenseGroupForm
        form={form}
      />
    </FormDialog>
  )
}
