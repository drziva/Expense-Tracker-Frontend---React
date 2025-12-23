import { Box, Typography } from "@mui/material";

type Props = {
  name: string;
};

export function EmptyState({ name }: Props) {
  return (
    <Box
      sx={{
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: "text.primary",
        }}
      >
        No {name} yet
      </Typography>

      <Typography
        sx={{
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        This section is currently empty.  
        Once you start adding {name}, they’ll appear here.
      </Typography>
    </Box>
  );
}
