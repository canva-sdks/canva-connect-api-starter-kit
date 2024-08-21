import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CastleIcon from "@mui/icons-material/Castle";
import { useAppContext } from "src/context";
import { Paths } from "src/routes";

const drawerWidth = 240;

export const SideBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthorized } = useAppContext();

  useEffect(() => {
    if (!isAuthorized) {
      navigate(Paths.HOME);
    }
  }, [navigate, isAuthorized]);

  const sidebarItems = [
    {
      text: "Home",
      Icon: HomeIcon,
      route: Paths.HOME,
      disabled: false,
    },
    {
      text: "Playground",
      Icon: CastleIcon,
      route: Paths.PLAYGROUND,
      disabled: !isAuthorized,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Toolbar />
      <Box overflow="auto">
        <List>
          {sidebarItems.map(({ text, Icon, route, disabled }, i) => (
            <ListItem disablePadding={true} key={i}>
              <ListItemButton
                disabled={disabled}
                onClick={() => navigate(route)}
              >
                <ListItemIcon>
                  <Icon color="primary" />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
