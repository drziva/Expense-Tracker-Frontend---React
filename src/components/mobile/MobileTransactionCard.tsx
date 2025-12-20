import { Box, Paper, Typography } from "@mui/material";
import formatEuros from "../../utils/formatMoney";
import type { Expense } from "../../types/expenses.responses";
import type { Income } from "../../types/incomes.responses";

type Props = {
  data?: Income[] | Expense[];
  color: string;
}

export function MobileTransactionCard({color, data}: Props) {

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {data?.map(tx => (
        <Paper key={tx.id} sx={{ p: 2 }}>
          <Typography fontWeight={600}>
            {tx.description}
          </Typography>

          <Typography color={color} fontWeight={700}>
            +{formatEuros(tx.amount)}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {new Date(tx.createdAt).toLocaleDateString()} · {tx.groupName}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}