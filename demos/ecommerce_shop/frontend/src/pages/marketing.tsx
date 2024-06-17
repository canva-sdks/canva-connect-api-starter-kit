import { useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DeveloperNote } from "src/components";
import { Paths } from "src/routes";

export const MarketingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" gutterBottom={true}>
        Marketing
      </Typography>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={4}>
          <CallToActionPaper
            devNoteText="Single designs are generated using the create design API which is available to Canva users from all tiers and subscriptions."
            callToActionText="Single Design"
            callToActionDescription="Create a single design in your chosen size from an existing product"
            onClick={() => navigate(Paths.SINGLE_DESIGN_GENERATOR)}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <CallToActionPaper
            devNoteText="Multiple designs are generated using brand templates and autofill APIs which are only available to Canva Enterprise users."
            callToActionText="Multiple Designs"
            callToActionDescription="Create multiple designs at once by adding products to your Brand Templates"
            onClick={() => navigate(Paths.MULTIPLE_DESIGNS_GENERATOR)}
          />
        </Grid>
      </Grid>
    </>
  );
};

const CallToActionPaper = ({
  devNoteText,
  callToActionText,
  callToActionDescription,
  onClick,
}: {
  devNoteText: string;
  callToActionText: string;
  callToActionDescription: string;
  onClick: () => void;
}) => {
  return (
    <Box gap={2}>
      <DeveloperNote info={devNoteText} />
      <Paper
        variant="outlined"
        onClick={onClick}
        sx={{
          marginTop: 2,
          paddingTop: 2,
          paddingBottom: 2,
          paddingX: 4,
          borderRadius: 1,
          height: "100%",
          cursor: "pointer",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <AddIcon color="info" fontSize="large" />
          <Typography
            variant="h6"
            color={(theme) => theme.palette.success.main}
            marginY={2}
          >
            {callToActionText}
          </Typography>
          <Typography
            variant="subtitle2"
            color={(theme) => theme.palette.success.main}
            align="center"
          >
            {callToActionDescription}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
