import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(    
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </StrictMode>
  </ThemeProvider>
);
