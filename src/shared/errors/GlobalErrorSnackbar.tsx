import { Alert, Snackbar } from "@mui/material";
import { useError } from "@/app/providers/error/ErrorProvider";

export function GlobalErrorSnackbar() {
    const {error, clearError} = useError();

    return (
        <Snackbar
            open={!!error}
            autoHideDuration={3000}
            onClose={clearError}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            sx={{
                mt: 2
            }}
        >
            <Alert severity="error" onClose={clearError}>
                {error}
            </Alert>
        </Snackbar>
    )
}