import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { NavBar, SideBar, Alerts } from "./components";

export const App = () => (
  <Box display="flex">
    <CssBaseline />
    <NavBar />
    <SideBar />
    <Box component="main" paddingTop={3} paddingX={10} flexGrow={1}>
      <Toolbar />
      <Alerts />
      <Outlet />
    </Box>
  </Box>
);
