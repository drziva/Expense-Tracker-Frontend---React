import { api } from "@/shared/api/client";
import { LoginRequest, LoginResponse, SignUpRequest } from "../types/auth.types";

export async function login(dto: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", dto);
  return res.data;
}

export async function signUp(dto: SignUpRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/signup", dto);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
} 

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}