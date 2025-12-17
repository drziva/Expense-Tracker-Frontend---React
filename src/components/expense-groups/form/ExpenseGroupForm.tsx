import { Stack, TextField } from "@mui/material";
import type { z } from "zod";
import type { expenseGroupSchema } from "../../../schemas/expense-group.schema";
import type { UseFormReturn } from "react-hook-form";

type FormInput = z.input<typeof expenseGroupSchema>;
type FormOutput = z.infer<typeof expenseGroupSchema>

type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>
}

export function ExpenseGroupForm({form}: Props) {
  const {
    register,
    formState:{errors}
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
        autoFocus
      />
      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
      />
      <TextField
        label="Budget Cap"
        {...register("budgetCap")}
        error={!!errors.budgetCap}
        helperText={errors.budgetCap?.message}
        fullWidth
      />
    </Stack>
  )
}
