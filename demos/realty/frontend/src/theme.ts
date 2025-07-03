import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    backgroundBase?: string;
    backgroundHover?: string;
  }

  interface SimplePaletteColorOptions {
    backgroundBase?: string;
    backgroundHover?: string;
  }
}

export const theme = createTheme({
  palette: {
    mode: "light", // Change to light mode
    primary: {
      main: "#020249", // Anywhere dark navy blue
      dark: "#01012E", // Darker navy
      light: "#151563", // Lighter navy
    },
    secondary: {
      main: "#d50000", // Red
      dark: "#9b0000",
      light: "#ff5131",
      backgroundBase: "rgba(213, 0, 0, 0.05)", // Red transparent light
    },
    info: {
      main: "#020249", // Anywhere dark navy blue
    },
    success: {
      main: "#00c853", // Green
    },
    warning: {
      main: "#EA540A", // Anywhere orange
      light: "#FF7538", // Lighter orange
      backgroundBase: "rgba(234, 84, 10, 0.05)", // Orange transparent light
      backgroundHover: "rgba(234, 84, 10, 0.1)", // Orange transparent bold
    },
    error: {
      main: "#d50000", // Red
    },
    background: {
      default: "#ffffff", // White
      paper: "#f5f5f5", // Very light gray
    },
    text: {
      primary: "#212121", // Dark gray, almost black
      secondary: "#757575", // Medium gray
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});
