import { useEffect } from "react";
import { useError } from "@/app/providers/error/ErrorProvider";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query"

export function ErrorListener() {
    const { showError } = useError();
    const { setUser } = useAuth();
    const queryClient = useQueryClient();

    let isLoggingOut = false;

    useEffect(()=>{
        const handler = (event: Event) => {
            const custom = event as CustomEvent<string>;
            showError(custom.detail);
        }

        const authErrorHandler = (event: Event) => {
            if(isLoggingOut) return;

            isLoggingOut = true;
            setUser(null);
            queryClient.clear();
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