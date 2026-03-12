import { useCreateExpenseGroup } from "@/features/expense-groups/hooks/useCreateExpenseGroups";
import { FormDialog } from "@/shared/ui/FormDialog";
import { ExpenseGroupForm } from "@/features/expense-groups/components/form/ExpenseGroupForm";
import type { ExpenseGroup } from "@/features/expense-groups/types/expenseGroup.responses";
import { useUpdateExpenseGroup } from "@/features/expense-groups/hooks/useUpdateExpenseGroups";
import { Alert } from "@mui/material";
import { expenseGroupSchema } from "@/features/expense-groups/schemas/expense-group.schema";
import type { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  group?: ExpenseGroup | null;
  onChange?: (isDirty: boolean) => void;
  onSuccess: () => void;  
}

type FormInput = z.input<typeof expenseGroupSchema>
type FormOutput = z.infer<typeof expenseGroupSchema>

export function ExpenseGroupDialog({open, onClose, group, onChange, onSuccess}: Props) {
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

  useEffect(() => {
    if(isDirty && onChange) {
      onChange(true);
    };
    if(!isDirty && onChange) {
      onChange(false);
    }
  }, [isDirty]);

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
      onSuccess();
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
