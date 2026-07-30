import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/open-sans/800.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ContextProvider } from "./context";
import { routes } from "./routes";
import { theme } from "./theme";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = createRoot(rootElement);

const router = createHashRouter(routes);

// Global motion + chrome polish. Keyframes are referenced by components for
// staggered entrances; scrollbars and selection are restyled for a premium feel.
// Everything inside the reduced-motion guard is disabled for users who ask for it.
const globalStyles = (
  <GlobalStyles
    styles={{
      "html, body": { scrollBehavior: "smooth" },
      "#root": {
        animation: "appFadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      "@keyframes appFadeIn": {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      "@keyframes cardRise": {
        from: { opacity: 0, transform: "translateY(22px) scale(0.985)" },
        to: { opacity: 1, transform: "translateY(0) scale(1)" },
      },
      "@keyframes fadeUp": {
        from: { opacity: 0, transform: "translateY(14px)" },
        to: { opacity: 1, transform: "translateY(0)" },
      },
      "@keyframes modalPop": {
        from: { opacity: 0, transform: "translate(-50%, -50%) scale(0.94)" },
        to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
      },
      ".modal-pop": {
        animation: "modalPop 0.34s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
      // Staggered card entrance — delay controlled by --card-index CSS variable.
      ".rise-in": {
        animation: "cardRise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        animationDelay: "calc(var(--card-index, 0) * 60ms)",
      },
      ".fade-up": {
        animation: "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        animationDelay: "calc(var(--card-index, 0) * 55ms)",
      },
      "*::-webkit-scrollbar": { width: 11, height: 11 },
      "*::-webkit-scrollbar-track": { background: "transparent" },
      "*::-webkit-scrollbar-thumb": {
        background: "rgba(125, 42, 231, 0.4)",
        borderRadius: 8,
        border: "3px solid transparent",
        backgroundClip: "content-box",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background: "rgba(125, 42, 231, 0.65)",
        backgroundClip: "content-box",
      },
      "::selection": { background: "rgba(0, 196, 204, 0.28)" },
      "@media (prefers-reduced-motion: reduce)": {
        "*, *::before, *::after": {
          animationDuration: "0.001ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.001ms !important",
          scrollBehavior: "auto !important",
        },
      },
    }}
  />
);

root.render(
  <ThemeProvider theme={theme}>
    <ContextProvider>
      <CssBaseline />
      {globalStyles}
      <RouterProvider router={router} />
    </ContextProvider>
  </ThemeProvider>,
);
