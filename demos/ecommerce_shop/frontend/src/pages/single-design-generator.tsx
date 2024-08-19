import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import type { Design } from "@canva/connect-api-ts/types.gen";
import { Grid, Stack, Typography } from "@mui/material";
import {
  CampaignNameInput,
  CanvaIcon,
  DemoButton,
  FormPaper,
  PageDescriptor,
  PublishCampaignButtons,
  PublishDialog,
  SingleProductSelector,
} from "src/components";
import { useAppContext, useCampaignContext } from "src/context";
import { uploadAssetAndCreateDesignFromProduct } from "src/services";
import { DesignResult } from "src/components/marketing/design-result";
import { EditInCanvaPageOrigins } from "src/models";

export const SingleDesignGeneratorPage = () => {
  const { campaignName } = useCampaignContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstGenerated, setIsFirstGenerated] = useState(false);

  const {
    addAlert,
    createdSingleDesign,
    setCreatedSingleDesign,
    selectedCampaignProduct,
  } = useAppContext();

  const onCreate = async () => {
    if (!selectedCampaignProduct) {
      return;
    }
    setIsLoading(true);
    try {
      const design = await uploadAssetAndCreateDesignFromProduct({
        campaignName,
        product: selectedCampaignProduct,
      });
      setCreatedSingleDesign(design.design);
      setIsFirstGenerated(true);
      addAlert({
        title: `Canva design was successfully generated for '${selectedCampaignProduct.name}'.`,
        variant: "success",
        hideAfterMs: -1,
      });
    } catch (error) {
      addAlert({
        title: "Something went wrong. Please try again later.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container={true} spacing={3}>
      <PageDescriptor
        title="Single Design"
        description="Create a single design in your chosen size from an existing product"
      />
      <Grid item={true} xs={8}>
        {createdSingleDesign && selectedCampaignProduct ? (
          <SingleDesignResult
            createdDesign={createdSingleDesign}
            setCreatedDesign={setCreatedSingleDesign}
            firstGenerated={isFirstGenerated}
          />
        ) : (
          <SingleCampaignForm isLoading={isLoading} onCreate={onCreate} />
        )}
      </Grid>
    </Grid>
  );
};

const SingleCampaignForm = ({
  isLoading,
  onCreate,
}: {
  isLoading: boolean;
  onCreate: () => void;
}) => {
  const { campaignName } = useCampaignContext();
  const { setSelectedCampaignProduct } = useAppContext();

  return (
    <Stack spacing={4}>
      <CampaignNameInput disabled={isLoading} />
      <FormPaper>
        <Stack spacing={4} marginBottom={4}>
          <Typography variant="h5" marginBottom={4}>
            Select product details
          </Typography>
          <SingleProductSelector disabled={isLoading} />
        </Stack>

        <DemoButton
          demoVariant="primary"
          loading={isLoading}
          onClick={onCreate}
          disabled={!setSelectedCampaignProduct || !campaignName}
          fullWidth={true}
          startIcon={<CanvaIcon />}
        >
          CREATE DESIGN IN CANVA
        </DemoButton>
      </FormPaper>
    </Stack>
  );
};

const SingleDesignResult = ({
  createdDesign,
  setCreatedDesign,
  firstGenerated = false,
}: {
  createdDesign: Design;
  setCreatedDesign: (design: Design | undefined) => void;
  firstGenerated?: boolean;
}) => {
  const { selectedCampaignProduct } = useAppContext();
  const { campaignName } = useCampaignContext();
  const [publishDialogIsOpen, setPublishDialogIsOpen] = useState(false);
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

  return (
    <Stack spacing={4}>
      <FormPaper>
        <Typography variant="h6" gutterBottom={true}>
          {createdDesign.title}
        </Typography>
        <Stack spacing={2}>
          <DesignResult
            design={createdDesign}
            correlationStateOnNavigateToCanva={{
              originPage: EditInCanvaPageOrigins.MARKETING_SINGLE,
              originProductId: selectedCampaignProduct?.id,
            }}
          />
        </Stack>
      </FormPaper>
      <PublishCampaignButtons
        onCancel={() => setCreatedDesign(undefined)}
        onPublish={() => {
          if (campaignName) {
            setPublishDialogIsOpen(true);
          }
        }}
        publishDisabled={!campaignName}
      />
      <PublishDialog
        isOpen={publishDialogIsOpen}
        onOpenChange={setPublishDialogIsOpen}
      />
    </Stack>
  );
};
