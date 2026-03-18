import { InputAdornment, Stack, TextField, useMediaQuery } from "@mui/material";
import type { z } from "zod";
import type { expenseGroupSchema } from "@/features/expense-groups/schemas/expense-group.schema";
import { Controller, type UseFormReturn } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type FormInput = z.input<typeof expenseGroupSchema>;
type FormOutput = z.infer<typeof expenseGroupSchema>

type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>
}

export function ExpenseGroupForm({form}: Props) {
  const {
    register,
    formState:{errors},
    control
  } = form
  const isMobile = useMediaQuery("(max-width: 600px)");
  
  return(
    <Stack
      sx={{
        gap:"12px",
        minWidth: isMobile ? "150px" :"480px",
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
      <Controller
        name="budgetCap"
        control={control}
        render={({ field }) => (
          <NumericFormat
            name={field.name}
            value={(field.value as string) ?? ""}
            customInput={TextField}
            label="Budget Cap"
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values) => {
              field.onChange(values.value);
            }}
            error={!!errors.budgetCap}
            helperText={errors.budgetCap?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    €
                  </InputAdornment>
                )
              },
              htmlInput: {
                "data-cy": "income-amount-input",
                "data-testid": "income-amount-input"
              }
            }}
          />
        )}
      />
    </Stack>
  )
}
