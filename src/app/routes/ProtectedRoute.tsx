import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
    )
}