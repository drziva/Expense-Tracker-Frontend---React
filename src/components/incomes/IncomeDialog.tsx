import { useEffect } from "react";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "../ui/FormDialog";
import type { z } from "zod";
import { incomeSchema } from "../../schemas/income.schema";
import { useCreateIncome } from "../../hooks/incomes/useCreateIncome";
import { useUpdateIncome } from "../../hooks/incomes/useUpdateIncome";
import { useIncomeGroups } from "../../hooks/income-groups/useIncomeGroups";
import { IncomeForm } from "./form/IncomeForm";
import type { Income } from "../../types/incomes.responses";

type Props = {
  open: boolean;
  onClose: () => void;
  income?: Income | null;
};

type FormInput = z.input<typeof incomeSchema>;
type FormOutput = z.infer<typeof incomeSchema>;

export function IncomeDialog({ open, onClose, income }: Props) {
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const { data, isError, isPending } = useIncomeGroups();

  const isUpdate = !!income;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      description: "",
      amount: "",
      groupId: "",
    },
  });

  const groups = data?.data ?? [];

  useEffect(() => {
    if (!open) {
      form.reset();
      createIncome.reset();
      updateIncome.reset();
      return;
    }

    if (isUpdate && income) {
      form.reset({
        description: income.description,
        amount: String(income.amount),
        groupId: String(income.groupId),
      });
    }
  }, [open, isUpdate, income]);

  async function onSubmit(data: FormOutput) {
    try {
      if (!isUpdate) {
        await createIncome.mutateAsync(data);
      } else if (income) {
        await updateIncome.mutateAsync({
          id: income.id,
          req: data,
        });
      }
      onClose();
    } catch {}
  }

  const rawError = isUpdate
    ? updateIncome.error?.response?.data.message
    : createIncome.error?.response?.data.message;

  const apiError = Array.isArray(rawError) ? rawError[0] : rawError;

  return (
    <FormDialog
      open={open}
      title={isUpdate ? "Update Income" : "Create Income"}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      submitting={createIncome.isPending || updateIncome.isPending}
    >
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load income groups.
        </Alert>
      )}

      {!isPending && groups.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must create an income group before adding incomes.
        </Alert>
      )}

      <IncomeForm form={form} groups={groups} />
    </FormDialog>
  );
}
