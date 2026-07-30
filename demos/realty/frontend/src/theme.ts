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

// Premium easing + timing tokens. Exported so components reuse identical curves
// instead of hardcoding magic strings throughout the codebase.
export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  fast: "0.18s",
  base: "0.32s",
  slow: "0.55s",
};

// ── Brix & Hart × Canva brand language ──────────────────────────────────────
// Editorial real-estate structure (sharp corners, price-hero cards) recolored
// in Canva's brand palette: charcoal ink, violet accent, turquoise/blue
// secondary tones, and Canva's signature gradient for CTAs.
// Canva's product UI font is "Canva Sans" (proprietary). Open Sans is Canva's
// documented fallback for Canva Sans in product UI, so we use it here.
const ink = "#0E1318";
const inkSoft = "#454B54";
const violet = "#7D2AE7";
const violetDark = "#6418C4";
const violetSoft = "rgba(125, 42, 231, 0.10)";
const turquoise = "#00C4CC";
const blue = "#3969E7";
const coral = "#FE6F61";
const canvas = "#F4F4F8";
const paper = "#FFFFFF";
const line = "rgba(14, 19, 24, 0.12)";

const canvaGradient = `linear-gradient(135deg, ${turquoise} 0%, ${blue} 45%, ${violet} 100%)`;

const display = '"Open Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const sans = '"Open Sans", system-ui, -apple-system, "Segoe UI", sans-serif';

export const brand = {
  ink,
  inkSoft,
  violet,
  violetDark,
  violetSoft,
  turquoise,
  blue,
  coral,
  canvas,
  line,
  canvaGradient,
  display,
  sans,
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: ink,
      dark: "#070A0D",
      light: inkSoft,
    },
    secondary: {
      main: violet,
      dark: violetDark,
      light: "#9B5BF0",
      backgroundBase: violetSoft,
      backgroundHover: "rgba(125, 42, 231, 0.18)",
    },
    info: {
      main: blue,
    },
    success: {
      main: turquoise,
    },
    warning: {
      main: violet,
      light: "#9B5BF0",
      backgroundBase: violetSoft,
      backgroundHover: "rgba(125, 42, 231, 0.18)",
    },
    error: {
      main: coral,
    },
    background: {
      default: canvas,
      paper,
    },
    text: {
      primary: ink,
      secondary: inkSoft,
    },
    divider: line,
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: sans,
    h1: { fontFamily: display, fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontFamily: display, fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: display, fontWeight: 800, letterSpacing: "-0.018em" },
    h4: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.012em" },
    h5: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.005em" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "0.02em" },
    body1: { letterSpacing: "0.005em" },
    body2: { letterSpacing: "0.01em", color: inkSoft },
    overline: { letterSpacing: "0.18em", fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: "0.04em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: canvas },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          borderRadius: 2,
          fontWeight: 600,
          fontSize: "0.78rem",
          letterSpacing: "0.08em",
          padding: "10px 22px",
          position: "relative",
          overflow: "hidden",
          transition: `transform ${motion.base} ${motion.ease}, box-shadow ${motion.base} ${motion.ease}, background-color ${motion.fast} ${motion.ease}, border-color ${motion.fast} ${motion.ease}`,
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 8px 20px -10px rgba(26, 31, 43, 0.5)",
          },
          "&:active": { transform: "translateY(0)" },
          // Subtle shine sweep on hover.
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-120%",
            width: "55%",
            height: "100%",
            background:
              "linear-gradient(120deg, transparent, rgba(255,255,255,0.28), transparent)",
            transform: "skewX(-20deg)",
            transition: `left ${motion.slow} ${motion.ease}`,
            pointerEvents: "none",
          },
          "&:hover::after": { left: "150%" },
        },
        containedPrimary: {
          backgroundColor: ink,
          "&:hover": { backgroundColor: "#0E1219" },
        },
        // Canva gradient call-to-action.
        containedSecondary: {
          background: canvaGradient,
          color: "#fff",
          "&:hover": { background: canvaGradient, filter: "brightness(1.05)" },
        },
        outlined: {
          borderColor: line,
          borderWidth: "1px",
          "&:hover": {
            borderColor: ink,
            borderWidth: "1px",
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "0 1px 2px rgba(26, 31, 43, 0.04)",
          border: `1px solid ${line}`,
          transition: `transform ${motion.base} ${motion.ease}, box-shadow ${motion.base} ${motion.ease}, border-color ${motion.base} ${motion.ease}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontWeight: 600,
          letterSpacing: "0.04em",
          transition: `transform ${motion.fast} ${motion.ease}, box-shadow ${motion.fast} ${motion.ease}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 1px 2px rgba(26, 31, 43, 0.04)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          transition: `background-color ${motion.fast} ${motion.ease}, color ${motion.fast} ${motion.ease}`,
          "&:hover": { backgroundColor: violetSoft },
          "&.Mui-selected": {
            backgroundColor: "transparent",
            borderLeft: `2px solid ${violet}`,
            "&:hover": { backgroundColor: violetSoft },
          },
        },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined" } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: "#fff",
          transition: `box-shadow ${motion.fast} ${motion.ease}`,
          "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${violetSoft}`,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: violet },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 3,
          fontSize: "0.72rem",
          letterSpacing: "0.02em",
          backgroundColor: "rgba(26, 31, 43, 0.94)",
          backdropFilter: "blur(4px)",
          padding: "7px 11px",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(26, 31, 43, 0.5)",
          backdropFilter: "blur(3px)",
          "&.MuiBackdrop-invisible": {
            backgroundColor: "transparent",
            backdropFilter: "none",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
          boxShadow: "0 30px 80px -24px rgba(26, 31, 43, 0.5)",
        },
      },
    },
  },
});
