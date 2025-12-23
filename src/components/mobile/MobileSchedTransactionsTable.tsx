import { Box, Button, Paper, Typography } from "@mui/material";
import type { Income } from "../../types/incomes.responses";
import type { Expense } from "../../types/expenses.responses";
import formatEuros from "../../utils/formatMoney";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import type { SchedTransaction } from "../../types/scheduled-transactions.responses";

type Props = {
  data?: SchedTransaction[];
  onEdit: (tx: SchedTransaction) => void;
  onDelete: (tx: SchedTransaction) => void;
}

export function MobileSchedTransactionsTable({data, onEdit, onDelete}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {data?.map(tx => (
        <Paper key={tx.id} sx={{ p: 0.7, pr: 0, pl:1}}>
        <Box
          sx={{
            display: "flex",
            justifyContent:"space-between",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              p:0.5
            }}
          >
            <Typography fontWeight={600}>
              {tx.description}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Type: {tx.type}
            </Typography>


            <Typography
              color={tx.type === "income" ? "success" : "error"}
            >
              {formatEuros(tx.amount)}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Scheduled for: {new Date(tx.date).toLocaleDateString()}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {
                tx.type === "expense" ? tx.expenseGroupName : tx.incomeGroupName
              }
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
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