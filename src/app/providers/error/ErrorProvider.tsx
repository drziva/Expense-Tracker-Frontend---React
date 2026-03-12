import { createContext, ReactNode, useContext, useState } from "react";

type ErrorContextType = {
    error: string | null;
    showError: (message: string) => void
    clearError: () => void
};

const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorProvider({children}: {children: ReactNode}) {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{error, showError, clearError}}>
            {children}
        </ErrorContext.Provider>
    )
};

export function useError() {
    const ctx = useContext(ErrorContext);

    if(!ctx) {
        throw new Error("useError must be called from within ErrorProvider in the React Tree");
    }

    return ctx;
}
