import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

export function GlobalOfflineSnackbar() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        }
    }, [])

    return (
        <Snackbar 
            open={!isOnline}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert severity="warning">
                The app is currently offline. Some features may not be available until connection is restored.
            </Alert>
        </Snackbar>
    );
}