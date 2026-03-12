import type z from "zod"
import type { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses"
import { incomeGroupSchema } from "@/features/income-groups/schemas/income-group.schema"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCreateIncomeGroup } from "@/features/income-groups/hooks/useCreateIncomeGroups"
import { useUpdateIncomeGroup } from "@/features/income-groups/hooks/useUpdateIncomeGroups"

import { useEffect } from "react"

import { IncomeGroupForm } from "@/features/income-groups/components/form/IncomeGroupForm"
import { FormDialog } from "@/shared/ui/FormDialog"

import {
  Alert,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material"

import PaymentsIcon from "@mui/icons-material/Payments"

type FormInput = z.input<typeof incomeGroupSchema>
type FormOutput = z.infer<typeof incomeGroupSchema>

type Props = {
  open: boolean
  onClose: () => void
  group?: IncomeGroup | null
  onChange?: (isDirty: boolean) => void
  onSuccess: () => void
}

export function IncomeGroupDialog({
  open,
  onClose,
  group,
  onChange,
  onSuccess
}: Props) {

  const createIncomeGroup = useCreateIncomeGroup()
  const updateIncomeGroup = useUpdateIncomeGroup()

  const isUpdate = !!group

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(incomeGroupSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })

  const { formState: { isDirty } } = form

  useEffect(() => {
    if (!open) {
      form.reset()
      createIncomeGroup.reset()
      updateIncomeGroup.reset()
      return
    }

    if (isUpdate && group) {
      form.reset({
        name: group.name,
        description: group.description
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
      if (!isUpdate) {
        await createIncomeGroup.mutateAsync(data)
      } else {
        await updateIncomeGroup.mutateAsync({
          id: group!.id,
          req: data
        })
      }

      onSuccess()
    } catch {}
  }

  const rawError = isUpdate
    ? updateIncomeGroup.error?.response?.data.message
    : createIncomeGroup.error?.response?.data.message

  const error = Array.isArray(rawError) ? rawError[0] : rawError

  return (
    <FormDialog
      open={open}
      action={isUpdate ? "Update" : "Create"}
      submitting={isUpdate ? updateIncomeGroup.isPending : createIncomeGroup.isPending}
      title={isUpdate ? "Update Income Group" : "Create Income Group"}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
    >

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3
        }}
      >
        <Stack spacing={2}>

          <Stack direction="row" alignItems="center" spacing={1}>
            <PaymentsIcon color="success" />
            <Typography variant="h6">
              {isUpdate ? "Income Group Details" : "New Income Group"}
            </Typography>
          </Stack>

          <Divider />

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <IncomeGroupForm form={form} />

        </Stack>
      </Paper>

    </FormDialog>
  )
}