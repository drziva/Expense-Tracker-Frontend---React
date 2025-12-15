import { createTheme } from "@mui/material/styles";

const sharedComponents = {
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        color: theme.palette.text.secondary,

        "&:hover": {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
};

const sharedTypography = {
  fontFamily: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    "Arial",
    "sans-serif",
  ].join(","),
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#399bc2ff",
    },
  },
  typography: sharedTypography,
  components: sharedComponents,
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0a59ceff",
    },
  },
  typography: sharedTypography,
  components: sharedComponents,
});