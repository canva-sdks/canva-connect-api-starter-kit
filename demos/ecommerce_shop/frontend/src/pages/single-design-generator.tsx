import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import type { Design } from "@canva/connect-api-ts/types.gen";
import {
  Box,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
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

export const SingleDesignGeneratorPage = () => {
  const { campaignName, selectedProduct } = useCampaignContext();
  const [isLoading, setIsLoading] = useState(false);
  const [createdDesign, setCreatedDesign] = useState<Design | undefined>(
    undefined,
  );
  const { setErrors } = useAppContext();

  const onCreate = async () => {
    if (!selectedProduct) {
      return;
    }
    setIsLoading(true);
    try {
      const design = await uploadAssetAndCreateDesignFromProduct({
        campaignName,
        product: selectedProduct,
      });
      setCreatedDesign(design);
    } catch (error) {
      console.log(error);
      setErrors((prevState: string[]) =>
        prevState.concat("Something went wrong. Please try again later."),
      );
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
        {createdDesign && selectedProduct ? (
          <SingleDesignResult
            createdDesign={createdDesign}
            setCreatedDesign={setCreatedDesign}
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
  const { campaignName, selectedProduct } = useCampaignContext();

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
          disabled={!selectedProduct || !campaignName}
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
}: {
  createdDesign: Design;
  setCreatedDesign: (design: Design | undefined) => void;
}) => {
  const { campaignName, selectedProduct } = useCampaignContext();
  const [publishDialogIsOpen, setPublishDialogIsOpen] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { x: 0.55, y: 0.5 },
    });
  }, []);

  return (
    <Stack spacing={4}>
      <FormPaper>
        <Typography variant="h6" gutterBottom={true}>
          {createdDesign.title}
        </Typography>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 200,
                height: 200,
                borderRadius: 2,
                objectFit: "contain",
                bgcolor: "#302e35",
              }}
              image={createdDesign.thumbnail?.url || selectedProduct?.imageUrl}
              alt="design-thumbnail"
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Typography variant="h6">{campaignName}</Typography>

                <DemoButton
                  demoVariant="secondary"
                  startIcon={<CanvaIcon />}
                  onClick={() =>
                    window.open(
                      createdDesign.urls.edit_url,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  EDIT IN CANVA
                </DemoButton>
              </CardContent>
            </Box>
          </Box>
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
