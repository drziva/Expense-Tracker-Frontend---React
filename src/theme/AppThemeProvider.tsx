import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { darkTheme, lightTheme } from "./themes";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = prefersDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
