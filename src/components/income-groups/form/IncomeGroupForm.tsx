import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { incomeGroupSchema } from "../../../schemas/income-group.schema"
import { FormDialog } from "../../ui/FormDialog"
import { Stack, TextField } from "@mui/material"

type FormInput = z.input<typeof incomeGroupSchema>
type FormOutput = z.infer<typeof incomeGroupSchema>

type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>
}

export function IncomeGroupForm({form}: Props) {
  const {
    register,
    formState: {errors}
  } = form

  return(
    <Stack
      sx={{
        gap:"12px",
        minWidth:"480px",
        padding:"10px"
      }}
    >
      <TextField 
        label="Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField 
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
    </Stack>
  )
}