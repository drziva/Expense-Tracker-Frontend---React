import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

type Props = {
  title?: string;
  description?: string;
};

export function PremiumRequiredPage({
  title = "Premium feature",
  description = "This feature is available only for premium users.",
}: Props) {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <LockIcon fontSize="large" color="primary" />

          <Typography variant="h5">
            {title}
          </Typography>

          <Typography color="text.secondary">
            {description}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Upgrade to premium to unlock scheduled transactions, automation,
            and advanced financial tools.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => {
              // navigate to upgrade page or open modal
              // navigate("/premium");
            }}
          >
            Upgrade to Premium
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
