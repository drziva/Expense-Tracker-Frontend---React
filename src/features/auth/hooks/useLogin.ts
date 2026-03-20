import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/api/auth";
import type { LoginRequest, LoginResponse } from "@/features/auth/api/auth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      navigate("/dashboard");
    }
  })
} 