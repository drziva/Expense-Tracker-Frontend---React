import { useEffect } from "react"
import { Alert, Divider, Paper, Stack, Typography } from "@mui/material"

import ReceiptIcon from "@mui/icons-material/Receipt"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCreateExpense } from "@/features/expenses/hooks/useCreateExpense"
import { useUpdateExpense } from "@/features/expenses/hooks/useUpdateExpense"
import { useExpenseGroups } from "@/features/expense-groups/hooks/useExpenseGroups"

import { ExpenseForm } from "@/features/expenses/components/form/ExpenseForm"
import { FormDialog } from "@/shared/ui/FormDialog"

import type { Expense } from "@/features/expenses/types/expenses.responses"
import { expenseSchema } from "@/features/expenses/schemas/expense.schema"

import type { z } from "zod"

type Props = {
  open: boolean
  onClose: () => void
  expense?: Expense | null
  onChange?: (isDirty: boolean) => void
  onSuccess: () => void
}

type FormInput = z.input<typeof expenseSchema>
type FormOutput = z.infer<typeof expenseSchema>

export function ExpenseDialog({
  open,
  onClose,
  expense,
  onChange,
  onSuccess
}: Props) {

  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const { data, isError, isPending } = useExpenseGroups({})

  const isUpdate = !!expense

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      groupId: ""
    }
  })

  const { formState: { isDirty } } = form

  const groups = data?.data ?? []

  useEffect(() => {
    if (!open) {
      form.reset()
      createExpense.reset()
      updateExpense.reset()
      return
    }

    if (isUpdate && expense) {
      form.reset({
        description: expense.description,
        amount: String(expense.amount),
        groupId: String(expense.groupId)
      })
    }
  }, [open, isUpdate, expense])

  useEffect(() => {
    onChange?.(isDirty)
  }, [isDirty])

  async function onSubmit(data: FormOutput) {

    if (isUpdate && !isDirty) {
      onClose()
      return
    }

    try {
      if (!isUpdate) {
        await createExpense.mutateAsync(data)
      } else if (expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          req: data
        })
      }

      onSuccess()

    } catch {}
  }

  const rawError =
    isUpdate
      ? updateExpense.error?.response?.data.message
      : createExpense.error?.response?.data.message

  const apiError = Array.isArray(rawError) ? rawError[0] : rawError

  return (
    <FormDialog
      open={open}
      title={isUpdate ? "Update Expense" : "Create Expense"}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      submitting={
        isUpdate
          ? updateExpense.isPending
          : createExpense.isPending
      }
    >

      <Paper
        sx={{
          borderRadius: 3
        }}
      >

        <Stack spacing={2}>

          <Stack direction="row" alignItems="center" spacing={1}>
            <ReceiptIcon color="error" />
            <Typography variant="h6">
              {isUpdate ? "Expense Details" : "New Expense"}
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
              Failed to load expense groups.
            </Alert>
          )}

          {!isPending && groups.length === 0 && (
            <Alert severity="warning">
              You must create an expense group before adding expenses.
            </Alert>
          )}

          <ExpenseForm
            form={form}
            groups={groups}
          />

        </Stack>

      </Paper>

    </FormDialog>
  )
}