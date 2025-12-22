import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import type { LoginRequest, LoginResponse } from "../../api/auth";
import { useAuth } from "../../auth/AuthProvider";

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