import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/api/auth";
import type { LoginRequest, LoginResponse } from "@/features/auth/api/auth";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
      navigate("/dashboard");
    }
  })
} 