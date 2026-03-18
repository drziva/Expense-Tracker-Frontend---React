import { api } from "@/shared/api/client";

export async function registerFirebaseToken(token: string) {
    const res = await api.post("/firebase/register", { token });
    return res;
}