import { useCreateExpenseGroup } from "@/features/expense-groups/hooks/useCreateExpenseGroups"
import { useUpdateExpenseGroup } from "@/features/expense-groups/hooks/useUpdateExpenseGroups"

import { FormDialog } from "@/shared/ui/FormDialog"
import { ExpenseGroupForm } from "@/features/expense-groups/components/form/ExpenseGroupForm"

import type { ExpenseGroup } from "@/features/expense-groups/types/expenseGroup.responses"

import { expenseGroupSchema } from "@/features/expense-groups/schemas/expense-group.schema"

import type { z } from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useEffect } from "react"

import {
  Alert,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material"

import ReceiptIcon from "@mui/icons-material/Receipt"

type Props = {
  open: boolean
  onClose: () => void
  group?: ExpenseGroup | null
  onChange?: (isDirty: boolean) => void
  onSuccess: () => void
}

type FormInput = z.input<typeof expenseGroupSchema>
type FormOutput = z.infer<typeof expenseGroupSchema>

export function ExpenseGroupDialog({
  open,
  onClose,
  group,
  onChange,
  onSuccess
}: Props) {

  const createExpenseGroup = useCreateExpenseGroup()
  const updateExpenseGroup = useUpdateExpenseGroup()

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(expenseGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      budgetCap: ""
    }
  })

  const { formState: { isDirty } } = form
  const isUpdate = !!group

  useEffect(() => {
    if (!open) {
      form.reset()
      createExpenseGroup.reset()
      updateExpenseGroup.reset()
      return
    }

    if (isUpdate && group) {
      form.reset({
        name: group.name,
        description: group.description,
        budgetCap: group.budgetCap === undefined
          ? ""
          : String(group.budgetCap)
      })
    }
  }, [open, group])

  useEffect(() => {
    onChange?.(isDirty)
  }, [isDirty])

  async function onSubmit(data: FormOutput) {
    if (isUpdate && !isDirty) {
      onClose()
      return
    }

    try {
      if (isUpdate && group) {
        await updateExpenseGroup.mutateAsync({
          id: group.id,
          req: data
        })
      } else {
        await createExpenseGroup.mutateAsync(data)
      }

      onSuccess()

    } catch {}
  }

  const rawError =
    isUpdate
      ? updateExpenseGroup.error?.response?.data?.message
      : createExpenseGroup.error?.response?.data?.message

  const apiError = Array.isArray(rawError) ? rawError[0] : rawError

  return (
    <FormDialog
      open={open}
      title={isUpdate ? "Update Expense Group" : "Create Expense Group"}
      action={isUpdate ? "Update" : "Create"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      submitting={
        isUpdate
          ? updateExpenseGroup.isPending
          : createExpenseGroup.isPending
      }
    >

      <Paper
        sx={{
          p: 0,
          borderRadius: 3
        }}
      >

        <Stack spacing={2}>

          <Stack direction="row" alignItems="center" spacing={1}>
            <ReceiptIcon color="error" />
            <Typography variant="h6">
              {isUpdate
                ? "Expense Group Details"
                : "New Expense Group"}
            </Typography>
          </Stack>

          <Divider />

          {apiError && (
            <Alert severity="error">
              {apiError}
            </Alert>
          )}

          <ExpenseGroupForm form={form} />

        </Stack>

      </Paper>

    </FormDialog>
  )
}