import React from "react";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean,
    error?: Error
};

export class AppErrorBoundary extends React.Component<Props, State> {
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
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 12,
                }}
                >
                <h1>Something went wrong</h1>
                <p>The application crashed. Please refresh the page.</p>
                <button onClick={() => window.location.reload()}>
                    Reload
                </button>
            </div>
            )
        }
        return this.props.children;
    }
}