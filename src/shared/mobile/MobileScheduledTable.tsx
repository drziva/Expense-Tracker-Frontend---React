import { Box, Button, Paper, Typography } from "@mui/material";
import type { Income } from "@/features/incomes/types/incomes.responses";
import type { Expense } from "@/features/expenses/types/expenses.responses";
import formatEuros from "@/shared/lib/formatMoney";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import type { ScheduledTransaction } from "@/features/scheduled-transactions/types/scheduledTransactions.responses";

type Props = {
  data?: ScheduledTransaction[];
}

export function MobileScheduledTable({data}: Props) {
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
          <Box
            sx={{
              display: "flex",
              flexDirection:"column"
            }}
          >
            <Typography fontWeight={600}>
              {tx.description}
            </Typography>

            <Typography fontWeight={700}>
              {formatEuros(tx.amount)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Type: {tx.type}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              Scheduled for: {new Date(tx.date).toLocaleDateString()} · {tx.type === "income" ? tx.incomeGroupId : tx.expenseGroupId}
            </Typography>
          </Box>
        </Box>
        </Paper>
      ))}
    </Box>
  )
}