import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { Box, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useCampaignContext } from "src/context";
import { CanvaIcon, DemoAlert, DemoButton, FormPaper } from "src/components";
import type { CreateDesignAutofillJobResponse } from "@canva/connect-api-ts/types.gen";

export const AutofillResults = (props: {
  autoFillResults: CreateDesignAutofillJobResponse[];
}) => {
  const { campaignName } = useCampaignContext();
  const [alertIsOpen, setAlertIsOpen] = useState(true);

  const autofilledDesigns = props.autoFillResults
    .map((res) => res.job.result?.design)
    .filter(
      (
        result,
      ): result is Required<
        CreateDesignAutofillJobResponse["job"]
      >["result"]["design"] => !!result,
    );

  useEffect(() => {
    if (autofilledDesigns.length) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { x: 0.55, y: 0.5 },
      });
    }
  }, [autofilledDesigns.length]);

  if (!autofilledDesigns) {
    return (
      <FormPaper>
        <Typography>No results found. Please try again.</Typography>
      </FormPaper>
    );
  }

  const GeneratedDesignsAlert = () => (
    <DemoAlert
      severity="success"
      alertTitle={
        autofilledDesigns.length === 1
          ? "1 Canva design was generated"
          : `${autofilledDesigns.length} Canva designs were generated`
      }
      onClose={() => setAlertIsOpen(false)}
      sx={{ marginBottom: 2 }}
    />
  );

  return (
    <FormPaper>
      <Typography variant="h6" gutterBottom={true}>
        {campaignName}
      </Typography>
      {alertIsOpen && <GeneratedDesignsAlert />}
      <Stack spacing={2}>
        {autofilledDesigns.map((design) => (
          <Box key={design.url} display="flex" padding={2} borderRadius={2}>
            <CardMedia
              component="img"
              sx={{
                width: 200,
                height: 200,
                borderRadius: 2,
                objectFit: "contain",
                bgcolor: "#302e35",
              }}
              image={design.thumbnail?.url}
              alt="autofill-image"
            />
            <Box display="flex" alignItems="center">
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Typography variant="h6">{campaignName}</Typography>
                <DemoButton
                  demoVariant="secondary"
                  startIcon={<CanvaIcon />}
                  onClick={() =>
                    window.open(design.url, "_blank", "noopener,noreferrer")
                  }
                >
                  EDIT IN CANVA
                </DemoButton>
              </CardContent>
            </Box>
          </Box>
        ))}
      </Stack>
    </FormPaper>
  );
};
