import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/app", { replace: true });
        },
      }
    );
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          placeItems: "center",
          background: theme =>
            `radial-gradient(circle at top, ${theme.palette.primary.main} 0%, ${theme.palette.background.default} 100%)`,
        }}
      >
        <Box
          component="img"
          src="/vega-it-logo-2.png"
          alt="VegaIT"
          sx={{
            height: 132,
            filter: theme => theme.palette.mode === "light" ? "invert(1)" : "none",
            transition: "filter 0.2s ease"
          }}
        />
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
            backdropFilter: "blur(8px)",
          }}
        >
          
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 1.5,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <LockOutlinedIcon />
              </Box>

              <Typography variant="h5" fontWeight={600}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log in to continue
              </Typography>
            </Box>

            {loginMutation.isError && (
              <Alert severity="error">
                Login failed. Check your credentials and try again.
              </Alert>
            )}

            <TextField
              name="email"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              fullWidth
              slotProps={{
                htmlInput: {
                  "data-cy": "login-email",
                },
              }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              fullWidth
              slotProps={{
                htmlInput: {
                  "data-cy": "login-password",
                },
              }}
            />

            <Button
              name="submit"
              type="submit"
              size="large"
              variant="contained"
              disabled={loginMutation.isPending}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 600,
              }}
              data-cy="login-submit"
            >
              {loginMutation.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Log in"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
