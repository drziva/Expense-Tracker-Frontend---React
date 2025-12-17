import { useEffect, useState } from "react";
import { useCreateExpenseGroup } from "../../hooks/expense-groups/useCreateExpenseGroups";
import { FormDialog } from "../ui/FormDialog";
import { ExpenseGroupForm } from "./form/ExpenseGroupForm";
import type { ExpenseGroup } from "../../types/expenseGroup.responses";
import { useUpdateExpenseGroup } from "../../hooks/expense-groups/useUpdateExpenseGroups";
import { Alert } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  group?: ExpenseGroup | null;
}

export function ExpenseGroupDialog({open, onClose, group}: Props) {
  const createExpenseGroup = useCreateExpenseGroup();
  const updateExpenseGroup = useUpdateExpenseGroup();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budgetCap, setBudgetCap] = useState("");
  
  function resetForm(){
    setName("");
    setDescription("");
    setBudgetCap("");
  }

  const isUpdate = !!group;
  const title = isUpdate ? 
    "Update Expense Group" :
    "Create Expense Group";

  useEffect(() => {
    if(!open) {
      createExpenseGroup.reset();
      updateExpenseGroup.reset();
      resetForm();
      return;
    };

    if (isUpdate && group) {
      setName(group.name);
      setDescription(group.description);
      setBudgetCap(group.budgetCap != null ? String(group.budgetCap) : "");
    }
  },[open, group])


  async function handleSubmit() {
    const payload = {
      name,
      description,
      budgetCap: budgetCap.trim() === "" ? null : Number(budgetCap)
    }

    try {
      if(!isUpdate) {
        await createExpenseGroup.mutateAsync(payload);
      }
      if(isUpdate) {
        await updateExpenseGroup.mutateAsync({
          id: group.id,
          req: payload
        });
      }
      onClose();
    } catch{

    }
  }

  const isSubmitting =
    isUpdate
      ? updateExpenseGroup.isPending
      : createExpenseGroup.isPending;

  const rawError = 
    isUpdate 
      ? updateExpenseGroup.error?.response?.data?.message
      : createExpenseGroup.error?.response?.data?.message

  const error = Array.isArray(rawError) ? rawError[0] : rawError
  
  return(
    <FormDialog
      open={open}
      title={title}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
    > 
      {
        error && 
        <Alert severity="error">
          {error ?? `The has been an error ${isUpdate ? "updating" : "creating"} the expense group` }
        </Alert>
      }
      <ExpenseGroupForm
        name={name}
        description={description}
        budgetCap={budgetCap}
        onBudgetCapChange={setBudgetCap}
        onDescriptionChange={setDescription}
        onNameChange={setName}
      />
    </FormDialog>
  )
}