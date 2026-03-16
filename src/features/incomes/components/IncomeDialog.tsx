import { useEffect } from "react";
import {
  Alert,
  Box,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormDialog } from "@/shared/ui/FormDialog";

import type { z } from "zod";
import { incomeSchema } from "@/features/incomes/schemas/income.schema";

import { useCreateIncome } from "@/features/incomes/hooks/useCreateIncome";
import { useUpdateIncome } from "@/features/incomes/hooks/useUpdateIncome";
import { useIncomeGroups } from "@/features/income-groups/hooks/useIncomeGroups";

import { IncomeForm } from "@/features/incomes/components/form/IncomeForm";
import type { Income } from "@/features/incomes/types/incomes.responses";

type Props = {
  open: boolean;
  onClose: () => void;
  income?: Income | null;
  onChange?: (isDirty: boolean) => void;
  onSuccess: () => void;
};

type FormInput = z.input<typeof incomeSchema>;
type FormOutput = z.infer<typeof incomeSchema>;

export function IncomeDialog({
  open,
  onClose,
  income,
  onChange,
  onSuccess,
}: Props) {

  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const { data, isError, isPending } = useIncomeGroups({});

  const isUpdate = !!income;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      description: "",
      amount: "",
      groupId: "",
    },
  });

  const {
    formState: { isDirty }
  } = form;

  const groups = data?.data ?? [];

  useEffect(() => {
    onChange?.(isDirty);
  }, [isDirty]);

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
    if (isUpdate && !isDirty) {
      onClose();
      return;
    }

    try {
      if (!isUpdate) {
        await createIncome.mutateAsync(data);
      } else if (income) {
        await updateIncome.mutateAsync({
          id: income.id,
          req: data,
        });
      }

      onSuccess();
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
      <Paper>
        <Stack spacing={2}>

          <Stack direction="row" alignItems="center" spacing={1}>
            <PaymentsIcon color="success" />
            <Typography variant="h6">
              {isUpdate ? "Income Details" : "New Income"}
            </Typography>
          </Stack>

          <Divider />

          {apiError && (
            <Alert severity="error">
              {apiError}
            </Alert>
          )}

          {isError && (
            <Alert severity="error">
              Failed to load income groups.
            </Alert>
          )}

          {!isPending && groups.length === 0 && (
            <Alert severity="warning">
              You must create an income group before adding incomes.
            </Alert>
          )}

          <IncomeForm form={form} groups={groups} />

        </Stack>
      </Paper>
    </FormDialog>
  );
}