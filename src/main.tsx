import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App';
import { AppThemeProvider } from './theme/AppThemeProvider';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastProvider } from './toast/ToastProvider';
import { AuthProvider } from './auth/AuthProvider';
import { AppErrorBoundary } from './components/common/errors/AppErrorBoundary';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(    
  //<StrictMode>
      <AppThemeProvider>
        <AppErrorBoundary>
          <ToastProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <App />
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={false} />
              </QueryClientProvider>
            </LocalizationProvider>
          </ToastProvider>
        </AppErrorBoundary>
      </AppThemeProvider>
  //</StrictMode>
);
