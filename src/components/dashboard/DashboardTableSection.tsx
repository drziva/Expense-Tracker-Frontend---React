import { Box, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";
import formatEuros from "../../utils/formatMoney";

type DashboardTableSectionProps = {
  title: string;
  total: number;
  color: "success.main" | "error.main";
  sign?: "+" | "-";
  children: ReactNode;
};

export function DashboardTableSection({
  title,
  total,
  color,
  sign,
  children,
}: DashboardTableSectionProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color,
          }}
        >
          {sign}
          {formatEuros(total)}
        </Typography>
      </Box>

      {children}
    </Paper>
  );
}
