import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { useAppContext, useCampaignContext } from "src/context";
import { FormPaper } from "src/components";
import type { Design } from "@canva/connect-api-ts/types.gen";
import { DesignResult } from "./design-result";
import { EditInCanvaPageOrigins } from "src/models";

export const AutofillResults = ({
  designResults,
  firstGenerated = false,
}: {
  designResults: Design[];
  firstGenerated?: boolean;
}) => {
  const { selectedCampaignProduct } = useAppContext();
  const { campaignName } = useCampaignContext();

  const multiDesignIds = designResults.map((design) => design.id);

  useEffect(() => {
    // Only trigger confetti animation when the designs are first generated
    // otherwise not when returning from 'Edit in Canva'.
    if (!firstGenerated) {
      return;
    }

    confetti({
      particleCount: 200,
      spread: 70,
      origin: { x: 0.55, y: 0.5 },
    });
  }, [firstGenerated]);

  if (!designResults) {
    return (
      <FormPaper>
        <Typography>No results found. Please try again.</Typography>
      </FormPaper>
    );
  }

  return (
    <FormPaper>
      <Typography variant="h6" gutterBottom={true}>
        {campaignName}
      </Typography>
      <Stack spacing={2}>
        {designResults.map((design) => (
          <DesignResult
            key={design.id}
            design={design}
            correlationStateOnNavigateToCanva={{
              originPage: EditInCanvaPageOrigins.MARKETING_MULTI,
              originProductId: selectedCampaignProduct?.id,
              originMarketingMultiDesignIds: multiDesignIds,
            }}
          />
        ))}
      </Stack>
    </FormPaper>
  );
};
