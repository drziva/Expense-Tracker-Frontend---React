import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      {email, password},
      {
        onSuccess: () => {
          navigate("/app",{ replace: true });
        }
      },
    );
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 660, mx: "auto", mt: 10, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5">Login</Typography>
      {loginMutation.isError && (
          <Alert severity="error">
            Login failed. Check your credentials and try again.
          </Alert>
      )}

      <TextField
        label="Email"
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        autoComplete="email"
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="contained"
        disabled = {loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </Box>
  )

}