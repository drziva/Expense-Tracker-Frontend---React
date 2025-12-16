import { createTheme } from "@mui/material/styles";

const colors = {
  dark: {
    bg: "#0B0F14",
    paper: "#121824",
    textPrimary: "#E5E7EB",
    textSecondary: "#9CA3AF",
    divider: "rgba(255,255,255,0.08)",
  },
  light: {
    bg: "#F8FAFC",
    paper: "#FFFFFF",
    textPrimary: "#485164ff",
    textSecondary: "#475569",
    divider: "rgba(0,0,0,0.08)",
  },
  primary: "#7C3AED",
  success: "#5bcc84ff",
  error: "#da5c5cff",
};

const typography = {
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

const sharedComponents = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        color: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,

        "&.Mui-selected": {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.primary.main,
        },

        "&:hover": {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },

  MuiTableCell: {
    styleOverrides: {
      head: ({ theme }: any) => ({
        color: theme.palette.text.primary,
        fontWeight: 700,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
      body: ({ theme }: any) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.dark.bg,
      paper: colors.dark.paper,
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.success,
    },
    error: {
      main: colors.error,
    },
    text: {
      primary: colors.dark.textPrimary,
      secondary: colors.dark.textSecondary,
    },
    divider: colors.dark.divider,
  },

  shape: {
    borderRadius: 14,
  },

  typography,

  components: sharedComponents,
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: colors.light.bg,
      paper: colors.light.paper,
    },
    primary: {
      main: "#0A59CE",
    },
    secondary: {
      main: colors.success,
    },
    error: {
      main: colors.error,
    },
    text: {
      primary: colors.light.textPrimary,
      secondary: colors.light.textSecondary,
    },
    divider: colors.light.divider,
  },

  shape: {
    borderRadius: 14,
  },

  typography,

  components: sharedComponents,
});
