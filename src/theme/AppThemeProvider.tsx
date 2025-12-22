import {
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { createContext, useContext, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "./themes";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const stored = localStorage.getItem("theme") as ThemeMode | null;
  
  const [mode, setMode] = useState<ThemeMode>(() => 
    stored ?? (prefersDark ? "dark" : "light")
  );

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used inside AppThemeProvider");
  }
  return ctx;
}
