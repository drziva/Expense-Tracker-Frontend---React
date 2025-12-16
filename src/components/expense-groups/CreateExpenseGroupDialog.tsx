import { useEffect, useState } from "react";
import { useCreateExpenseGroup } from "../../hooks/expense-groups/useCreateExpenseGroup";
import { FormDialog } from "../ui/FormDialog";
import { ExpenseGroupForm } from "./form/ExpenseGroupForm";
import { Alert } from "@mui/material";

type Props = {
  open: boolean;
  onClose: ()=> void;
}

export function CreateExpenseGroupDialog({open, onClose}: Props) {
  const createExpenseGroup = useCreateExpenseGroup();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budgetCap, setBudgetCap] = useState("");
  
  function resetForm(){
    setName("");
    setDescription("");
    setBudgetCap("");
  }

  async function handleSubmit() {
    try{
      await createExpenseGroup.mutateAsync({
        name,
        description,
        budgetCap: budgetCap.trim() === "" ? null : Number(budgetCap)
      })

      resetForm();
      onClose();
    } catch(error) {

    }
  }

  useEffect(() => {
    if(!open) {
      createExpenseGroup.reset();
      resetForm();
    }
  },[open])

  return(
    <FormDialog
      open={open}
      title="Create expense group"
      action="Create"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={createExpenseGroup.isPending}
    > 
      {
        createExpenseGroup.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createExpenseGroup.error?.response?.data?.message ??
              "Failed to create expense group"}
          </Alert>
        )
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