import { Alert } from "@mui/material";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormDialog } from "@/shared/ui/FormDialog";
import { ScheduledTransactionForm } from "@/features/scheduled-transactions/components/form/ScheduledTransactionForm";
import { scheduledTransactionSchema } from "@/features/scheduled-transactions/schemas/scheduled-transaction.schema";

import type { SchedTransaction } from "@/features/scheduled-transactions/types/scheduled-transactions.responses";
import { useCreateSchedTransaction } from "@/features/scheduled-transactions/hooks/useCreateSchedTransaction";
import { useUpdateSchedTransaction } from "@/features/scheduled-transactions/hooks/useUpdateSchedTransaction";

type Props = {
  open: boolean;
  onClose: () => void;
  transaction?: SchedTransaction | null;
  onChange?: (isDirty: boolean) => void;
  onSuccess: () => void;
};

type FormInput = z.input<typeof scheduledTransactionSchema>;
type FormOutput = z.infer<typeof scheduledTransactionSchema>;

export function ScheduledTransactionDialog({
  open,
  onClose,
  transaction,
  onChange,
  onSuccess
}: Props) {
  const createTx = useCreateSchedTransaction();
  const updateTx = useUpdateSchedTransaction();

  const isUpdate = !!transaction;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(scheduledTransactionSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      date: "",
      type: undefined,
      incomeGroupId: undefined,
      expenseGroupId: undefined,
    },
  });

  const {formState: {isDirty}} = form;

  useEffect(() => {
    if (!open) {
      form.reset();
      createTx.reset();
      updateTx.reset();
      return;
    }

    if (isUpdate && transaction) {
      form.reset({
        description: transaction.description,
        amount: String(transaction.amount),
        date: transaction.date,
        type: transaction.type,
        incomeGroupId: transaction.incomeGroupId,
        expenseGroupId: transaction.expenseGroupId,
      });
    }
  }, [open, transaction]);

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
      if (isUpdate && transaction) {
        await updateTx.mutateAsync({
          id: transaction.id,
          req: data,
        });
      } else {
        await createTx.mutateAsync(data);
      }
      onSuccess();
    } catch {}
  }

  const title = isUpdate
    ? "Update Scheduled Transaction"
    : "Create Scheduled Transaction";

  const isSubmitting = isUpdate
    ? updateTx.isPending
    : createTx.isPending;

  const rawError = isUpdate
    ? updateTx.error?.response?.data?.message
    : createTx.error?.response?.data?.message;

  const apiError = Array.isArray(rawError) ? rawError[0] : rawError;

  return (
    <FormDialog
      open={open}
      title={title}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      submitting={isSubmitting}
    >
      {apiError && (
        <Alert severity="error">
          {`There has been an error ${
            isUpdate ? "updating" : "creating"
          } the scheduled transaction`}
        </Alert>
      )}

      <ScheduledTransactionForm form={form} />
    </FormDialog>
  );
}
