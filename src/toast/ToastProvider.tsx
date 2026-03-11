import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

type ToastSeverity = "success" | "error";

type ToastContextValue = {
  showToast: (message: string, severity?: ToastSeverity) => void
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("success");

  function showToast (msg: string, sev: ToastSeverity = "success") {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          mt: 10
        }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          data-cy="toast-alert"
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}