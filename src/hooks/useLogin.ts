import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import type { LoginRequest, LoginResponse } from "../api/auth";

export function useLogin() {
  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
    }
  })
}