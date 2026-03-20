import { useEffect } from "react";
import { useError } from "@/app/providers/error/ErrorProvider";
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";

export function ErrorListener() {
    const { showError } = useError();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(()=>{
        const handler = (event: Event) => {
            const custom = event as CustomEvent<string>;
            showError(custom.detail);
        }

        const authErrorHandler = (event: Event) => {
            const custom = event as CustomEvent<string>;
            navigate("/login");
            showError(custom.detail);
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