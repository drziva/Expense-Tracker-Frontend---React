import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { useCreateExpense } from "../../hooks/expenses/useCreateExpense";
import { useUpdateExpense } from "../../hooks/expenses/useUpdateExpense";
import { useExpenseGroups } from "../../hooks/expense-groups/useExpenseGroups";
import { ExpenseForm } from "./form/ExpenseForm";
import { FormDialog } from "../ui/FormDialog";
import type { Expense } from "../../types/expenses.requests";

type Props = {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
};

export function ExpenseDialog({ open, onClose, expense }: Props) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { data, isError, isPending } = useExpenseGroups();

  const isUpdate = !!expense;

  const title = isUpdate ? "Update Expense" : "Create Expense";
  const isSubmitting = isUpdate
    ? updateExpense.isPending
    : createExpense.isPending;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState("");

  function resetForm() {
    setDescription("");
    setAmount("");
    setGroupId("");
  }

  useEffect(() => {
    if (!open) {
      createExpense.reset();
      updateExpense.reset();
      resetForm();
      return;
    }

    if (isUpdate && expense) {
      setDescription(expense.description);
      setAmount(String(expense.amount));
      setGroupId(String(expense.groupId));
    }
  }, [open, isUpdate, expense]);

  const groups = data?.data ?? [];

  const amountNumber = Number(amount);
  const groupIdNumber = Number(groupId);

  const canSubmit =
    !isPending &&
    !isSubmitting &&
    groups.length > 0 &&
    description.trim() !== "" &&
    amount.trim() !== "" &&
    !Number.isNaN(amountNumber) &&
    amountNumber > 0 &&
    groupId.trim() !== "" &&
    !Number.isNaN(groupIdNumber);

  async function handleSubmit() {
    if (!canSubmit) return;

    const payload = {
      description,
      amount: amountNumber,
      groupId: groupIdNumber,
    };

    try {
      if (!isUpdate) {
        await createExpense.mutateAsync(payload);
      } else if (expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          req: payload,
        });
      }
      onClose();
    } catch {}
  }

  const rawError = isUpdate
    ? updateExpense.error?.response?.data.message
    : createExpense.error?.response?.data.message;

  const error = Array.isArray(rawError) ? rawError[0] : rawError;

  return (
    <FormDialog
      open={open}
      title={title}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load expense groups.
        </Alert>
      )}

      {!isPending && groups.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must create an expense group before adding expenses.
        </Alert>
      )}

      <ExpenseForm
        description={description}
        amount={amount}
        groups={groups}
        groupId={groupId}
        onAmountChange={setAmount}
        onDescriptionChange={setDescription}
        onGroupIdChange={setGroupId}
      />
    </FormDialog>
  );
}
