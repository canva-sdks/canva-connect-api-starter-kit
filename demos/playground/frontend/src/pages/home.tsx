import { Box, Card, CardContent, Typography } from "@mui/material";
import { ConnectButton, DeveloperNote } from "src/components";
import { useAppContext } from "src/context";

export const HomePage = () => {
  const { displayName } = useAppContext();

  return (
    <>
      <Typography variant="h4" gutterBottom={true}>
        {displayName ? `Good day, ${displayName}!` : `Good day!`}
      </Typography>
      <ConnectToCanvaCta />
    </>
  );
};
export const ConnectToCanvaCta = () => {
  return (
    <Card sx={{ minWidth: 275, paddingX: 5, paddingY: 2 }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom={true}>
          Connect to Canva
        </Typography>
        <Box paddingY={6}>
          <Typography
            variant="caption"
            align="center"
            paragraph={true}
            gutterBottom={true}
          >
            Connect the Canva integration to start experimenting with the
            Connect APIs
          </Typography>
          <Box display="flex" justifyContent="center">
            <ConnectButton />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <DeveloperNote info="Set up an integration in the developer portal before connecting to Canva" />
        </Box>
      </CardContent>
    </Card>
  );
};
