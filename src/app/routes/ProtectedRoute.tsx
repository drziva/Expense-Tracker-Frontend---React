import { useAuth } from "@/features/auth/context/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, isLoading, isError } = useAuth();
  
  // if(isLoading) {
  //   return <CircularProgress />;
  // }

  if(isError) {
    return <Navigate to="/login" replace />;
  }

  if(!user) {
    return <Navigate to="/login" replace />;
  } 

  return <Outlet/>;
}