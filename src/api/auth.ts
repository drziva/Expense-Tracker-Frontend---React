import { api } from "./client.ts";

export type LoginRequest = {
  email: string,
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: number,
    username: string,
    email: string,
    premium: boolean
  }
}; //refresh jwt token, http only cookie

export async function login(dto: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", dto);
  return res.data;
}