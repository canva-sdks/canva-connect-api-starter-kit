import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
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

// Global motion + chrome polish. Keyframes drive staggered card entrances;
// scrollbars and selection are restyled for the botanical brand feel.
// The reduced-motion guard disables all animation for users who request it.
const globalStyles = (
  <GlobalStyles
    styles={{
      "html, body": { scrollBehavior: "smooth" },
      body: {
        background:
          "radial-gradient(1100px 560px at 10% -10%, rgba(47, 169, 104, 0.14), transparent 60%)," +
          "radial-gradient(900px 480px at 100% 0%, rgba(217, 164, 65, 0.07), transparent 55%)," +
          "#0F1411",
        backgroundAttachment: "fixed",
      },
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
        background: "rgba(47, 169, 104, 0.3)",
        borderRadius: 8,
        border: "3px solid transparent",
        backgroundClip: "content-box",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background: "rgba(47, 169, 104, 0.5)",
        backgroundClip: "content-box",
      },
      "::selection": { background: "rgba(47, 169, 104, 0.3)" },
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
