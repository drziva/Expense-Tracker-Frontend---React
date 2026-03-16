import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import type { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses";

type Props = {
  data?: IncomeGroup[];
  onEdit: (gr: IncomeGroup) => void;
  onDelete: (gr: IncomeGroup) => void;
  onClick: (gr: IncomeGroup) => void;
}

export function MobileIncomeGroupTable({data, onEdit, onDelete, onClick}: Props) {
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
          <Box  onClick={() => onClick(gr)}>
            <Typography fontWeight={700}>
              {gr.name}
            </Typography>

            <Typography fontWeight={400} color="text.secondary">
              {gr.description}
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
                onEdit(gr);
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