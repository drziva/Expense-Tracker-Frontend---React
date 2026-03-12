import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ToastProvider } from "@/app/providers/toast/ToastProvider";

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

type Options = {
    route?: string;
};

export function renderApp(ui: React.ReactElement, options: Options = {}) {
    const queryClient = createTestQueryClient();
    const route = options.route || "/";

    function Wrapper({ children }: PropsWithChildren) {
        return (
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <MemoryRouter initialEntries={[route]}>
                        {children}
                    </MemoryRouter>
                </ToastProvider>
            </QueryClientProvider>
        )
    }

    return {
        queryClient,
        ...render(ui, { wrapper: Wrapper })
    }
}