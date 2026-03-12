import { useEffect } from "react";
import { useError } from "@/app/providers/error/ErrorProvider";

export function ErrorListener() {
    const { showError } = useError();

    useEffect(()=>{
        const handler = (event: Event) => {
            const custom = event as CustomEvent<string>;
            showError(custom.detail);
        }

        window.addEventListener("api-error", handler);

        return () => {
            window.removeEventListener("api-error", handler);
        }
    },[showError])

    return null;
}