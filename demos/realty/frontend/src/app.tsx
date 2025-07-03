import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { SideBar, Alerts } from "./components";

export const App = () => (
  <Box display="flex">
    <CssBaseline />
    <SideBar />
    <Box
      component="main"
      paddingTop={3}
      paddingX={10}
      flexGrow={1}
      sx={{ background: "#f4f8fb", minHeight: "100vh", paddingY: 6 }}
    >
      <Alerts />
      <Outlet />
    </Box>
  </Box>
);
