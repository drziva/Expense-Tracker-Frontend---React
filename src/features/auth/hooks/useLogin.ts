import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/api/auth";
import type { LoginRequest, LoginResponse } from "@/features/auth/api/auth";
import { useAuth } from "@/features/auth/context/AuthProvider";

export function useLogin() {
  const { setUser } = useAuth();

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("token", data.accessToken);
    }
  })
} 