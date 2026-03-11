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
    textPrimary: "#302f2fff",
    textSecondary: "#62666dff",
    divider: "rgba(0, 0, 0, 0.08)",
  },
  //violet: 9157f5ff
  //green : "b3d80cff"
  primary: "rgb(12, 216, 199)",
  success: "#5bcc84ff",
  error: "rgb(235, 79, 79)",
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
  MuiButtonBase: {
    styleOverrides: {
      root: {
        "&:focus": {
          outline: "none",
        },
        "&:focus-visible": {
          outline: "none",
          boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.4)",
        },
      },
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
      //"#9157f5ff"
      //main: "rgb(4, 121, 52)",
      main:"rgb(12, 216, 199)"
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
