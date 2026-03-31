import { Button, Typography, Stack, Box, Paper } from "@mui/material";
import { useVoiceConversation } from "@/features/eleven-labs/VoiceAgent";

export default function OnboardingWelcome() {
  const conversation = useVoiceConversation();

  const handleContinue = () => {
    conversation.sendUserMessage("continue onboarding");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 20%, rgba(12,216,199,0.15), transparent 40%), #0B0F14",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 5,
          borderRadius: 4,
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Stack spacing={4} alignItems="flex-start">
          {/* badge */}
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 999,
              background: "rgba(12,216,199,0.15)",
              border: "1px solid rgba(12,216,199,0.35)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgb(12,216,199)", fontWeight: 600 }}
            >
              AI guided setup
            </Typography>
          </Box>

          {/* headline */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome 👋
          </Typography>

          {/* description */}
          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            I’ll guide you through a short setup so your dashboard is ready in
            under a minute.
          </Typography>

          {/* CTA */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              height: 52,
              borderRadius: 3,
              fontSize: 16,
              fontWeight: 600,
              textTransform: "none",
              background:
                "linear-gradient(135deg, rgb(12,216,199), rgb(8,170,160))",
              boxShadow: "0 10px 30px rgba(12,216,199,0.35)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 14px 40px rgba(12,216,199,0.45)",
              },
            }}
          >
            Continue
          </Button>

          {/* helper text */}
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              width: "100%",
            }}
          >
            Takes ~30 seconds
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}