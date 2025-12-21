import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx';
import { AppThemeProvider } from './theme/AppThemeProvider.tsx';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(    
  <StrictMode>
    <AppThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </LocalizationProvider>
    </AppThemeProvider>
  </StrictMode>
);
