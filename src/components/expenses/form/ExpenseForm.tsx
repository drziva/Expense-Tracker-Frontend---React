import { Controller, type UseFormReturn } from "react-hook-form";
import type { ExpenseGroup } from "../../../types/expenseGroup.responses";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { expenseSchema } from "../../../schemas/expense.schema";
import type { z } from "zod";

type FormInput = z.input<typeof expenseSchema>;
type FormOutput = z.infer<typeof expenseSchema>;

type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>;
  groups: ExpenseGroup[];
};

export function ExpenseForm({form, groups}: Props) {
  const {
    register,
    formState: {errors}
  } = form

  return(
    <Stack
      sx={{
        gap: "12px",
        minWidth: "480px",
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
          Expense Group
        </InputLabel>

      <Controller
        name="groupId"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            labelId="expense-group-label"
            label="Expense Group"
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
