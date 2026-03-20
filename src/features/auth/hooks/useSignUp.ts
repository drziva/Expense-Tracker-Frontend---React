import { useMutation } from "@tanstack/react-query";
import { LoginResponse, signUp, SignUpRequest } from "../api/auth";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

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