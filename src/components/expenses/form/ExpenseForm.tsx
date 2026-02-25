import { Controller, type UseFormReturn } from "react-hook-form";
import type { ExpenseGroup } from "../../../types/expenseGroup.responses";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, useMediaQuery } from "@mui/material";
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
  const isMobile = useMediaQuery("(max-width: 600px)");

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
        slotProps={{
          htmlInput: {
            "data-cy": "expense-description-input",
            "data-testid": "expense-description-input"
          }
        }}
      />

      <TextField
        label="Amount"
        {...register("amount")}
        error={!!errors.amount}
        helperText={errors.amount?.message}
        slotProps={{
          htmlInput: {
            "data-cy": "expense-amount-input",
            "data-testid": "expense-amount-input"
          }
        }}
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
            data-cy="expense-group-select"
            data-testid="expense-group-select"
          >
            {groups.map((gr) => (
              <MenuItem 
                key={gr.id} 
                value={String(gr.id)}
                data-cy={`expense-group-option-${gr.id}`}
              >
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
