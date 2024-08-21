import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { ContextProvider } from "./context";
import { routes } from "./routes";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = createRoot(rootElement);

const router = createHashRouter(routes);

root.render(
  <ContextProvider>
    <CssBaseline />
    <RouterProvider router={router} />
  </ContextProvider>,
);
