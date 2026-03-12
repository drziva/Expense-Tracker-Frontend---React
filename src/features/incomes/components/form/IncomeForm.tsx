import type z from "zod"
import type { incomeSchema } from "@/features/incomes/schemas/income.schema"
import { Controller, type UseFormReturn } from "react-hook-form";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, useMediaQuery } from "@mui/material";
import type { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses";

type FormInput = z.input<typeof incomeSchema>;
type FormOutput = z.infer<typeof incomeSchema>;


type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>;
  groups: IncomeGroup[]
}

export function IncomeForm({form, groups}: Props) {
  const {
    register,
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
      <TextField
        label="Amount"
        {...register("amount")}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />
      <FormControl error={!!errors.groupId}>
        <InputLabel id="expense-group-label">
          Income Group
        </InputLabel>

      <Controller
        name="groupId"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            labelId="expense-group-label"
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