import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ConnectButton } from "../home/connect-button";
import { useAppContext } from "src/context";

const darkBlue = "#0A2A43";
const darkGreen = "#008009";

/**
 * Props for the PageHeader component
 */
type PageHeaderProps = {
  /** Title text to display in the header */
  title: string;
  /** Optional children to render on the right side of the header */
  children?: React.ReactNode;
};

/**
 * Page header component with title and optional content on the right
 */
export const PageHeader = ({
  title,
  children,
}: PageHeaderProps): JSX.Element => {
  const { isAuthorized } = useAppContext();

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingBottom={3}
      component="header"
      role="banner"
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 700,
          color: darkBlue,
          fontSize: { xs: 32, sm: 44 },
        }}
      >
        {title}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
        {children}
        <Box display="flex" alignItems="center">
          {isAuthorized && (
            <>
              <CheckCircleOutlineIcon
                sx={{ color: darkGreen, mr: 1, width: 20, height: 20 }}
              />
              <Typography sx={{ color: darkGreen, fontWeight: 500, mr: 2 }}>
                Connected to Canva
              </Typography>
            </>
          )}
          {!isAuthorized && (
            <>
              <InfoOutlinedIcon
                sx={{ color: darkBlue, mr: 1, width: 20, height: 20 }}
              />
              <Typography sx={{ color: darkBlue, fontWeight: 500, mr: 2 }}>
                Connect to Canva to create a design
              </Typography>
            </>
          )}
          <ConnectButton fullWidth={false} />
        </Box>
      </Box>
    </Box>
  );
};
