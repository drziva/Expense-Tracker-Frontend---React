import { Box, Button, Paper, Typography } from "@mui/material";
import type { Income } from "@/features/incomes/types/incomes.responses";
import type { Expense } from "@/features/expenses/types/expenses.responses";
import formatEuros from "@/shared/lib/formatMoney";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"

type Props = {
  data?: Income[] | Expense[];
  onEdit: (tx: Income | Expense) => void;
  onDelete: (tx: Income | Expense) => void;
  color: string;
}

export function MobileTransactionTable({data, onEdit, onDelete, color}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {data?.map(tx => (
        <Paper key={tx.id} sx={{ p: 0.7, pr: 0, pl:1}}>
        <Box
          sx={{
            display: "flex",
            justifyContent:"space-between"
          }}
        >
          <Box>
            <Typography fontWeight={600}>
              {tx.description}
            </Typography>

            <Typography fontWeight={700} color={color}>
              {formatEuros(tx.amount)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {new Date(tx.createdAt).toLocaleDateString()} · {tx.groupName}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            <Button
              size="small"
              onClick={() => onEdit(tx)}
            >
              <EditIcon fontSize="small"/>
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(tx)}
              data-cy={`delete-mobile-expense-button-${tx.id}`}
            >
              <DeleteIcon fontSize="small"/>
            </Button>
          </Box>
        </Box>
        </Paper>
      ))}
    </Box>
  )
}