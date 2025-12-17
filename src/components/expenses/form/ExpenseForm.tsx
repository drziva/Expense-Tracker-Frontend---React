import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import type { ExpenseGroup } from "../../../types/expenseGroup.responses";

type Props = {
  description: string;
  amount: string;
  groups: ExpenseGroup[];
  groupId: string;
  onDescriptionChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onGroupIdChange: (val: string) => void
}

export function ExpenseForm({
  description,
  amount,
  groups,
  groupId,
  onDescriptionChange,
  onAmountChange,
  onGroupIdChange
}: Props) {
  return(
    <Stack      
      sx={{
        gap:"12px",
        minWidth:"480px",
        padding:"10px"
    }}>
      <TextField
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <TextField
        label="Amount"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />

      <FormControl>
        <InputLabel id="expense-group-label">
          Expense Group
        </InputLabel>

        <Select
          labelId="expense-group-label"
          value={groupId}
          label="Expense Group"
          onChange={(e) => onGroupIdChange(e.target.value)}
        >
          {
            groups.map((gr)=>(
              <MenuItem key={gr.id} value={String(gr.id)}>
                {gr.name}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Stack>
  )
}