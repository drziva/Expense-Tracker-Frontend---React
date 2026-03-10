import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateExpense } from "../../hooks/expenses/useCreateExpense";
import { useUpdateExpense } from "../../hooks/expenses/useUpdateExpense";
import { useExpenseGroups } from "../../hooks/expense-groups/useExpenseGroups";
import { ExpenseForm } from "./form/ExpenseForm";
import { FormDialog } from "../ui/FormDialog";
import type { Expense } from "../../types/expenses.responses";
import { expenseSchema } from "../../schemas/expense.schema";
import type { z } from "zod";

type Props = {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onChange?: (isDirty: boolean) => void;
};

type FormInput = z.input<typeof expenseSchema>;
type FormOutput = z.infer<typeof expenseSchema>;

export function ExpenseDialog({ open, onClose, expense, onChange }: Props) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { data, isError, isPending } = useExpenseGroups({});

  const isUpdate = !!expense;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      groupId: "",
    },
  });

  const {formState: {isDirty}} = form;

  const groups = data?.data ?? [];

  useEffect(() => {
    if (!open) {
      form.reset();
      createExpense.reset();
      updateExpense.reset();
      return;
    }

    if (isUpdate && expense) {
      form.reset({
        description: expense.description,
        amount: String(expense.amount),
        groupId: String(expense.groupId),
      });
    }
  }, [open, isUpdate, expense]);

  useEffect(() => {
    if(isDirty && onChange) {
      onChange(true);
    };
    if(!isDirty && onChange) {
      onChange(false);
    }
  }, [isDirty])

  async function onSubmit(data: FormOutput) {
    if(isUpdate && !isDirty){
      onClose();
      return;
    }

    try {
      if (!isUpdate) {
        await createExpense.mutateAsync(data);
      } else if (expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          req: data,
        });
      }
      onClose();
    } catch {}
  }

  const rawError = isUpdate
    ? updateExpense.error?.response?.data.message
    : createExpense.error?.response?.data.message;

  const apiError = Array.isArray(rawError) ? rawError[0] : rawError;

  return (
    <FormDialog
      open={open}
      title={isUpdate ? "Update Expense" : "Create Expense"}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      submitting={createExpense.isPending || updateExpense.isPending}
    >
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
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

      <ExpenseForm form={form} groups={groups} />
    </FormDialog>
  );
}
