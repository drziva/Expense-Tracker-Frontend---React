import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import type { ExpenseGroup } from "../../types/expenseGroup.responses";

type Props = {
  data?: ExpenseGroup[];
  onEdit: (gr: ExpenseGroup) => void;
  onDelete: (gr: ExpenseGroup) => void;
}

export function MobileExpenseGroupTable({data, onEdit, onDelete}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {data?.map(gr => (
        <Paper key={gr.id} sx={{ p: 2, pr: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent:"space-between"
          }}
        >
          <Box>
            <Typography fontWeight={700}>
              {gr.name}
            </Typography>

            <Typography fontWeight={400} color="text.secondary">
              {gr.description}
            </Typography>

            <Typography color="text.secondary">
              {gr.budgetCap ? `Budget cap: ${gr.budgetCap}` : ""}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {new Date(gr.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            <Button
              size="small"
              onClick={() => onEdit(gr)}
            >
              <EditIcon fontSize="small"/>
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(gr)}
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