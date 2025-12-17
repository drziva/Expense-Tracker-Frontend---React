import { Stack, TextField } from "@mui/material";

type Props = {
  name: string;
  description: string;
  budgetCap?: string;
  onNameChange: (val: string) => void
  onDescriptionChange: (val: string) => void
  onBudgetCapChange: (val: string) => void
}

export function ExpenseGroupForm({
  name,
  description,
  budgetCap,
  onNameChange,
  onDescriptionChange,
  onBudgetCapChange
}: Props) {
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
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        fullWidth
        autoFocus
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        fullWidth
      />
      <TextField
        label="Budget Cap"
        value={budgetCap}
        onChange={(e) => onBudgetCapChange(e.target.value)}
        fullWidth
        inputMode="decimal"
      />
    </Stack>
  )
}