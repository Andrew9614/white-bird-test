import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#6366F1" },
    secondary: { main: "#F43F5E" },
    success: { main: "#10B981" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
    info: { main: "#0EA5E9" },
    background: {
      default: "#F7F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
    divider: "rgba(17, 24, 39, 0.08)",
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  typography: {
    fontFamily: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "Apple Color Emoji",
      "Segoe UI Emoji",
    ].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
    subtitle1: { color: "#374151" },
    subtitle2: { color: "#4B5563" },
    body1: { color: "#1F2937" },
    body2: { color: "#374151" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          colorScheme: "light",
        },
        body: {
          backgroundColor: "#F7F7FB",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "default",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "saturate(180%) blur(8px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) + 2,
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) + 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: "none",
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) - 2,
          textTransform: "none",
          fontWeight: 600,
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) - 4,
        }),
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
