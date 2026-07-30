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

// Shared easing + timing tokens — exported so components reuse identical curves
// instead of hardcoding magic strings.
export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  fast: "0.18s",
  base: "0.32s",
  slow: "0.55s",
};

// ── Nourish brand language ───────────────────────────────────────────────────
// A calm, botanical wellness identity: deep forest canvas, refined emerald
// (not harsh neon), warm cream text, and a touch of honey gold for warmth.
// Headings use Fraunces (organic serif); UI/body uses Inter.
const emerald = "#2FA968";
const emeraldLight = "#6FD79B";
const emeraldDark = "#1F7A48";
const honey = "#D9A441";
const cream = "#F3EFE6";
const creamSoft = "rgba(243, 239, 230, 0.64)";
const forest = "#0F1411";
const forestPaper = "#19211C";

const serif = '"Fraunces", "Iowan Old Style", Georgia, serif';
const sans = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';

export const brand = {
  emerald,
  emeraldLight,
  emeraldDark,
  honey,
  cream,
  creamSoft,
  forest,
  forestPaper,
  serif,
  sans,
};

const emeraldGradient = `linear-gradient(135deg, ${emeraldLight} 0%, ${emerald} 55%, ${emeraldDark} 100%)`;

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: emerald,
      light: emeraldLight,
      dark: emeraldDark,
      backgroundBase: "rgba(47, 169, 104, 0.14)",
      backgroundHover: "rgba(47, 169, 104, 0.22)",
    },
    secondary: {
      main: honey,
      light: "#E6BC6A",
      backgroundBase: "rgba(217, 164, 65, 0.16)",
    },
    info: {
      main: emeraldLight,
    },
    success: {
      main: emerald,
    },
    warning: {
      main: honey,
      light: "#E6BC6A",
      backgroundBase: "rgba(217, 164, 65, 0.16)",
      backgroundHover: "rgba(217, 164, 65, 0.26)",
    },
    error: {
      main: "#D9685E",
    },
    background: {
      default: forest,
      paper: forestPaper,
    },
    text: {
      primary: cream,
      secondary: creamSoft,
    },
    divider: "rgba(243, 239, 230, 0.1)",
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: sans,
    h3: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.005em" },
    h6: { fontFamily: serif, fontWeight: 600, letterSpacing: "0" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "0.01em" },
    overline: { letterSpacing: "0.18em", fontWeight: 700 },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
          transition: `transform ${motion.base} ${motion.spring}, box-shadow ${motion.base} ${motion.ease}, background-color ${motion.fast} ${motion.ease}`,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 28px -10px rgba(47, 169, 104, 0.5)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          // Shine sweep on hover.
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-120%",
            width: "60%",
            height: "100%",
            background:
              "linear-gradient(120deg, transparent, rgba(255,255,255,0.28), transparent)",
            transform: "skewX(-20deg)",
            transition: `left ${motion.slow} ${motion.ease}`,
            pointerEvents: "none",
          },
          "&:hover::after": {
            left: "140%",
          },
        },
        containedPrimary: {
          background: emeraldGradient,
          color: "#04210f",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: "1px solid rgba(243, 239, 230, 0.08)",
          transition: `transform ${motion.base} ${motion.spring}, box-shadow ${motion.base} ${motion.ease}, border-color ${motion.base} ${motion.ease}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 18,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: `transform ${motion.fast} ${motion.ease}, box-shadow ${motion.fast} ${motion.ease}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginInline: 8,
          transition: `background-color ${motion.fast} ${motion.ease}, transform ${motion.fast} ${motion.ease}, color ${motion.fast} ${motion.ease}`,
          "&:hover": {
            transform: "translateX(3px)",
            backgroundColor: "rgba(47, 169, 104, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(47, 169, 104, 0.16)",
            "& .MuiListItemText-primary": { fontWeight: 700, color: cream },
            "& .MuiListItemIcon-root svg": { color: emeraldLight },
            "&:hover": { backgroundColor: "rgba(47, 169, 104, 0.22)" },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: `box-shadow ${motion.fast} ${motion.ease}`,
          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(47, 169, 104, 0.18)",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.75rem",
          backgroundColor: "rgba(10, 14, 11, 0.92)",
          backdropFilter: "blur(4px)",
          padding: "6px 10px",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(8, 11, 9, 0.6)",
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
          borderRadius: 20,
          backgroundImage: "none",
          boxShadow: "0 30px 70px -20px rgba(0, 0, 0, 0.7)",
        },
      },
    },
  },
});
