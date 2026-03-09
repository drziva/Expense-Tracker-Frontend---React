import { Button } from "@mui/material";
import React from "react";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean,
    error?: Error
};

export class PageErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Global Error caught", error, info);
    }

    render() {
        if(this.state.hasError) {
            return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 12,
                }}
                >
                <h1>Something went wrong</h1>
                <p>The page crashed, please reload.</p>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Reload
                </Button>
            </div>
            )
        }
        return this.props.children;
    }
}