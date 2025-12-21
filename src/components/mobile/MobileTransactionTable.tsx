import { Box, Button, Paper, Typography } from "@mui/material";
import type { Income } from "../../types/incomes.responses";
import type { Expense } from "../../types/expenses.responses";
import formatEuros from "../../utils/formatMoney";
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
        <Paper key={tx.id} sx={{ p: 2, pr: 0 }}>
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