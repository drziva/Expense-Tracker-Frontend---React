import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  Stack,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Props = {
  open: boolean;
  name?: string;
  onClose: () => void;
};

export default function WelcomeDialog({ open, name, onClose }: Props) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? "20px" : "28px",
          overflow: "hidden"
        }
      }}
    >

      {/* header */}
      <Box
        sx={{
          px: isMobile ? 3 : 5,
          py: isMobile ? 4 : 5,
          background:
            "linear-gradient(135deg, #62eed7 0%, #38c1e4 40%, #06b6d4 100%)",
          color: "white"
        }}
      >

        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight={800}
          letterSpacing={-0.8}
        >
          Welcome{name ? `, ${name}` : ""} 👋
        </Typography>

        <Typography
          mt={1.5}
          sx={{
            opacity: 0.9,
            maxWidth: 520,
            fontSize: isMobile ? 15 : 18,
            lineHeight: 1.6
          }}
        >
          Your financial clarity starts here.
          Understand where your money goes, build stronger habits,
          and make decisions backed by real data.
        </Typography>

      </Box>

      <DialogContent>

        <Stack
          spacing={isMobile ? 3 : 4}
          mt={isMobile ? 2 : 3}
          mb={isMobile ? 1 : 2}
          alignItems="center"
        >

          <Typography
            sx={{
              maxWidth: 540,
              textAlign: "center",
              fontSize: isMobile ? 15 : 18,
              color: "text.secondary",
              lineHeight: 1.75,
              letterSpacing: 0.2
            }}
          >

            Consistency beats intensity.
            A few seconds of tracking each day compounds into
            clarity, control, and confidence over time.

          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onClose}
            fullWidth={isMobile}
            sx={{
              px: isMobile ? 3 : 6,
              height: isMobile ? 50 : 56,
              fontSize: isMobile ? 16 : 18,
              fontWeight: 700,
              borderRadius: "14px",
              boxShadow:
                "0 10px 25px rgba(81, 193, 228, 0.35)",
              textTransform: "none",
              maxWidth: 320
            }}
          >
            Start Tracking
          </Button>

        </Stack>

      </DialogContent>

    </Dialog>
  );
}