import type z from "zod"
import type { incomeSchema } from "@/features/incomes/schemas/income.schema"
import { Controller, type UseFormReturn } from "react-hook-form";
import { FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, useMediaQuery } from "@mui/material";
import type { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses";
import { NumericFormat } from "react-number-format";

type FormInput = z.input<typeof incomeSchema>;
type FormOutput = z.infer<typeof incomeSchema>;


type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>;
  groups: IncomeGroup[]
}

export function IncomeForm({form, groups}: Props) {
  const {
    register,
    control,
    formState: {errors}
  } = form;
  
  const isMobile = useMediaQuery("(max-width: 600px)")
  
  return(
    <Stack      
      sx={{
        gap: "12px",
        minWidth: isMobile ? "150px" :"480px",
        padding: "10px",
      }}
    >
      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <NumericFormat
            name={field.name}
            value={(field.value as string) ?? ""}
            customInput={TextField}
            label="Amount"
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values) => {
              field.onChange(values.value);
            }}
            error={!!errors.amount}
            helperText={errors.amount?.message}
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
      <FormControl error={!!errors.groupId}>
        <InputLabel id="income-group-label">
          Income Group
        </InputLabel>

      <Controller
        name="groupId"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            labelId="income-group-label"
            label="Income Group"
          >
            {groups.map((gr) => (
              <MenuItem key={gr.id} value={String(gr.id)}>
                {gr.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
        <FormHelperText>
          {errors.groupId?.message}
        </FormHelperText>
      </FormControl>
    </Stack>
  )
}