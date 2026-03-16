import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import type { ExpenseGroup } from "@/features/expense-groups/types/expenseGroup.responses";
import formatEuros from "@/shared/lib/formatMoney";

type Props = {
  data?: ExpenseGroup[];
  onClick: (gr: ExpenseGroup) => void;
  onEdit: (gr: ExpenseGroup) => void;
  onDelete: (gr: ExpenseGroup) => void;
}

export function MobileExpenseGroupTable({data, onEdit, onDelete, onClick}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {data?.map(gr => (
        <Paper key={gr.id} sx={{ p: 0.7, pr: 0, pl:1}}>
        <Box
          sx={{
            display: "flex",
            justifyContent:"space-between"
          }}
        >
          <Box
            onClick={() => onClick(gr)}
          >
            <Typography fontWeight={700}>
              {gr.name}
            </Typography>

            <Typography fontWeight={400} color="text.secondary">
              {gr.description}
            </Typography>

            <Typography color="text.secondary" variant="subtitle2">
              {gr.budgetCap ? `Budget cap: ${formatEuros(gr.budgetCap)}` : ""}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {new Date(gr.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(gr)
              }}
            >
              <EditIcon fontSize="small"/>
            </Button>
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(gr)
              }}
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