import { api } from "@/shared/api/client";

export async function toggleWelcomed() {
    const res = await api.put("/users/welcomed/toggle");
    return res.data;
}