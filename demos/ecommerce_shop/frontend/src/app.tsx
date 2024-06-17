import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { NavBar, SideBar, ErrorAlerts } from "./components";

export const App = () => (
  <Box display="flex">
    <CssBaseline />
    <NavBar />
    <SideBar />
    <Box component="main" paddingTop={3} paddingX={10} flexGrow={1}>
      <Toolbar />
      <ErrorAlerts />
      <Outlet />
    </Box>
  </Box>
);
