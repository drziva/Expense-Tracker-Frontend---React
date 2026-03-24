import { CircularProgress, Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthProvider";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}