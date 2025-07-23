import type { SvgIconProps } from "@mui/material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Paths } from "src/routes/routes";
import { useCallback } from "react";
import ListingsIcon from "src/components/icons/listing.svg";
import AssetsIcon from "src/components/icons/asset.svg";
import BrandTemplatesIcon from "src/components/icons/brand-templates.svg";
import { useAppContext } from "src/context";

// Fixed drawer width
const DRAWER_WIDTH = 240;

/**
 * Interface for sidebar navigation items
 */
type SidebarItem = {
  /** Display text for the navigation item */
  text: string;
  /** Icon component to display */
  Icon: React.ComponentType<SvgIconProps>;
  /** Route to navigate to when clicked */
  routes: string[];
  /** Optional tooltip text (defaults to the item text) */
  tooltip?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
};

/**
 * Sidebar navigation component displayed on the left side of the application
 */
export const SideBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthorized } = useAppContext();
  /**
   * Navigation items to display in the sidebar
   */
  const sidebarItems: SidebarItem[] = [
    {
      text: "Listings",
      Icon: ListingsIcon,
      routes: [Paths.PROPERTIES, Paths.ROOT],
      tooltip: "View and manage property listings",
    },
    {
      text: "Designs",
      Icon: AssetsIcon,
      routes: [Paths.DESIGNS],
      disabled: !isAuthorized,
      tooltip: "Access your generated designs",
    },
    {
      text: "Brand Templates",
      Icon: BrandTemplatesIcon,
      routes: [Paths.BRAND_TEMPLATES],
      disabled: !isAuthorized,
      tooltip: "View and use Brand Templates",
    },
  ];

  /**
   * Handles navigation when a sidebar item is clicked
   */
  const handleNavigation = useCallback(
    (routes: string[]): void => {
      // if we have multiple routes, this means they are aliases, so we navigate to the first one
      navigate(routes[0]);
    },
    [navigate],
  );

  // Styles for the drawer
  const drawerStyles = {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: DRAWER_WIDTH,
      boxSizing: "border-box",
      background: "#fff",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      paddingTop: "32px",
      paddingBottom: "32px",
      paddingLeft: "8px",
      paddingRight: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  };

  return (
    <Drawer variant="permanent" sx={drawerStyles} aria-label="Main navigation">
      {/* Logo at the top, centered */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        width="100%"
        mb={3}
        mt={1}
      >
        <img
          src="/brix-and-hart-logo.svg"
          alt="Brix & Hart Logo"
          style={{ width: 140, height: 55, paddingLeft: 16 }}
        />
      </Box>
      <Box overflow="auto" component="nav" sx={{ width: "100%" }}>
        <List aria-label="Navigation menu">
          {sidebarItems.map(
            ({ text, Icon, routes, tooltip, disabled = false }) => (
              <Tooltip
                title={
                  disabled
                    ? "Please connect with Canva to access this feature"
                    : tooltip
                }
                placement="right"
                key={text}
                arrow={true}
                enterDelay={500}
              >
                <ListItem disablePadding={true}>
                  <ListItemButton
                    disabled={disabled}
                    onClick={() => handleNavigation(routes)}
                    selected={routes.includes(location.pathname)}
                    sx={{
                      borderRadius: "12px",
                      "&.Mui-selected": {
                        backgroundColor: "#f0f8ff",
                        borderRadius: "12px",
                        "& .MuiListItemText-primary": {
                          fontWeight: "bold",
                        },
                        "&:hover": {
                          backgroundColor: "#e6f3ff",
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Icon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ),
          )}
        </List>
      </Box>
    </Drawer>
  );
};
