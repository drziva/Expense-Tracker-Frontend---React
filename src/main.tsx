import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from '@/app/App';
import { AppThemeProvider } from '@/app/providers/theme/AppThemeProvider';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastProvider } from '@/app/providers/toast/ToastProvider';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { AppErrorBoundary } from '@/shared/errors/AppErrorBoundary';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ErrorProvider } from '@/app/providers/error/ErrorProvider';
import { ErrorListener } from '@/app/providers/error/ErrorListener';
import { GlobalErrorSnackbar } from '@/shared/errors/GlobalErrorSnackbar';
import { registerSW } from "virtual:pwa-register";
import { GlobalOfflineSnackbar } from './shared/errors/GlobalOfflineSnackbar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      retry: (failureCount) => {
        return navigator.onLine && failureCount < 3;
      }
    },

    mutations: {
      networkMode: "always",
      retry: (failureCount) => {
        return navigator.onLine && failureCount < 3;
      }
    }
  }
});

registerSW({
  immediate: true
});

createRoot(document.getElementById('root')!).render(    
  //<StrictMode>
      <AppThemeProvider>
        <ErrorProvider>
          <AppErrorBoundary>
            <ErrorListener />
            <GlobalErrorSnackbar />
            <GlobalOfflineSnackbar />
            <ToastProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <QueryClientProvider client={queryClient}>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                  {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </QueryClientProvider>
              </LocalizationProvider>
            </ToastProvider>
          </AppErrorBoundary>
        </ErrorProvider>
      </AppThemeProvider>
  //</StrictMode>
);
