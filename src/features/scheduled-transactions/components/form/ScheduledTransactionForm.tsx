import {
  Stack,
  TextField,
  MenuItem,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import dayjs from "dayjs";

import type { scheduledTransactionSchema } from "@/features/scheduled-transactions/schemas/scheduled-transaction.schema";
import { useExpenseGroups } from "@/features/expense-groups/hooks/useExpenseGroups";
import { useIncomeGroups } from "@/features/income-groups/hooks/useIncomeGroups";

type FormInput = z.input<typeof scheduledTransactionSchema>;
type FormOutput = z.infer<typeof scheduledTransactionSchema>;

type Props = {
  form: UseFormReturn<FormInput, any, FormOutput>;
};

export function ScheduledTransactionForm({ form }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isMobile = useMediaQuery("(max-width: 600px)");
  const type = watch("type");

  const expenseGroups = useExpenseGroups({}).data?.data ?? [];
  const incomeGroups = useIncomeGroups({}).data?.data ?? [];

  useEffect(() => {
    if (type === "expense") {
      setValue("incomeGroupId", undefined);
    }
    if (type === "income") {
      setValue("expenseGroupId", undefined);
    }
  }, [type, setValue]);

  return (
    <Stack
      sx={{
        gap: "12px",
        minWidth: isMobile ? "150px" : "480px",
        padding: "10px",
      }}
    >
      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        autoFocus
        fullWidth
      />

      <TextField
        label="Amount"
        type="number"
        {...register("amount")}
        error={!!errors.amount}
        helperText={errors.amount?.message}
        fullWidth
      />

      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <DatePicker
            label="Date"
            value={field.value ? dayjs(field.value) : null}
            onChange={value =>
              field.onChange(value ? value.toISOString() : "")
            }
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date?.message,
              },
            }}
          />
        )}
      />

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <TextField
              select
              label="Type"
              fullWidth
              {...field}
              value={field.value ?? ""}
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>
          )}
        />

      {type === "expense" && (
        <Controller
          control={control}
          name="expenseGroupId"
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.expenseGroupId}>
              <InputLabel id="expense-group-label">
                Expense Group
              </InputLabel>
              <Select
                {...field}
                labelId="expense-group-label"
                label="Expense Group"
                value={field.value ?? ""}
                error={!!errors.type}
              >
                {expenseGroups.map(group => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}

      {type === "income" && (
        <Controller
          control={control}
          name="incomeGroupId"
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.incomeGroupId}>
              <InputLabel id="income-group-label">
                Income Group
              </InputLabel>
              <Select
                {...field}
                labelId="income-group-label"
                label="Income Group"
                value={field.value ?? ""}
              >
                {incomeGroups.map(group => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
    </Stack>
  );
}
