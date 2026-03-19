import { useEffect } from "react";
import { useError } from "@/app/providers/error/ErrorProvider";
import { useAuth } from "@/features/auth/context/AuthProvider";

export function ErrorListener() {
    const { showError } = useError();
    const { setUser } = useAuth();

    useEffect(()=>{
        const handler = (event: Event) => {
            const custom = event as CustomEvent<string>;
            showError(custom.detail);
        }

        const authErrorHandler = (event: Event) => {
            setUser(null);
        }

        window.addEventListener("api-error", handler);
        window.addEventListener("auth-error", authErrorHandler);

        return () => {
            window.removeEventListener("api-error", handler);
            window.removeEventListener("auth-error", authErrorHandler);
        }
    },[showError])

    return null;
}