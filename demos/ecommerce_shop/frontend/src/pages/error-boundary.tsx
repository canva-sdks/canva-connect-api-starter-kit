import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import type { ErrorResponse } from "react-router-dom";
import { Home, ReplayOutlined } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Stack, Typography } from "@mui/material";
import { DemoButton } from "src/components";
import { Paths } from "src/routes";

const NotFound = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Stack gap={2} width={400}>
      <Typography>
        Don't stress, these things happen. Head Home and continue on your demo
        journey.
      </Typography>
      <DemoButton
        startIcon={<Home />}
        demoVariant="secondary"
        onClick={() => navigate(Paths.HOME)}
      >
        RETURN HOME
      </DemoButton>
    </Stack>
  );
};

const GeneralError = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Stack gap={2} width={400}>
      <Typography>Address the reason above and/or reload the app.</Typography>
      <DemoButton
        startIcon={<ReplayOutlined />}
        demoVariant="secondary"
        onClick={() => navigate(0)}
      >
        RELOAD APP
      </DemoButton>
    </Stack>
  );
};

export const ErrorBoundaryPage = () => {
  const error = useRouteError() as Error | ErrorResponse;

  console.log(error);

  let errorSubHeading = "Whoops! Something went wrong!";
  let errorReason: string;
  let RecoverStepComponent: React.ReactNode = null;

  if (isRouteErrorResponse(error) && error.status === 404) {
    errorSubHeading = "No Page Found";
    errorReason = error.data;
    RecoverStepComponent = <NotFound />;
  } else if (error instanceof Error) {
    errorReason = `${error.name}: "${error.message}"`;
    RecoverStepComponent = <GeneralError />;
  } else {
    errorReason = "Error reason: unknown";
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={4}
      paddingTop={6}
      height="80vh"
    >
      <Typography variant="h3" fontWeight={700} color="error">
        （╯°□°）╯ Oh No!
      </Typography>
      <Typography variant="h4" color="error">
        {errorSubHeading}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="start"
        textAlign="left"
        gap={2}
        sx={{
          opacity: 0.8,
          paddingX: 3,
          paddingY: 2,
          minWidth: "400px",
          maxWidth: "800px",
          borderRadius: "8px",
          color: "secondary",
          backgroundColor: (theme) => theme.palette.secondary.backgroundBase,
        }}
      >
        <ErrorOutlineIcon color="inherit" />
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {errorReason}
        </Typography>
      </Box>
      {RecoverStepComponent}
    </Box>
  );
};
