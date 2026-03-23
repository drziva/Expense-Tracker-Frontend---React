import { useMutation } from "@tanstack/react-query";
import { LoginResponse, SignUpRequest } from "../types/auth.types";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/auth";

export function useSignUp() {
  const navigate = useNavigate();

  return useMutation<
    LoginResponse,
    AxiosError<{ message?: string | string[] }>,
    SignUpRequest
  >({
      mutationFn: signUp,
      onSuccess: (data) => {
        navigate("/dashboard");
      }
  })
}