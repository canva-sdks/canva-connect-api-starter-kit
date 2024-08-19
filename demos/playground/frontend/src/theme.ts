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
    mode: "dark",
    primary: {
      main: "#00c853", // Green
    },
    secondary: {
      main: "#ffffff", // White
      backgroundBase: "rgba(255, 255, 255, 0.16)", // White transparent light
    },
    info: {
      main: "#a5d6a7", // light green
    },
    success: {
      main: "#66bb6a", // Green
    },
    warning: {
      main: "#ef6c00", // Orange
      light: "#F28932", // Light orange
      backgroundBase: "rgba(239, 108, 0, 0.15)", // Orange transparent light
      backgroundHover: "rgba(239, 108, 0, 0.25)", // Orange transparent bold
    },
    error: {
      main: "#9c27b0", // Purple
    },
    background: {
      default: "#121212", // Black
      paper: "#1e1e1e", // Grey
    },
    text: {
      primary: "#ffffff", // White
    },
  },
});
