import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx';
import { AppThemeProvider } from './theme/AppThemeProvider.tsx';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastProvider } from './toast/ToastProvider.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';
import { AppErrorBoundary } from './components/common/errors/AppErrorBoundary.tsx';

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
              </QueryClientProvider>
            </LocalizationProvider>
          </ToastProvider>
        </AppErrorBoundary>
      </AppThemeProvider>
  //</StrictMode>
);
