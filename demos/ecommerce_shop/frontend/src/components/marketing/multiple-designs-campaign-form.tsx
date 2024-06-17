import { useState } from "react";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import { Stack, Typography } from "@mui/material";
import {
  BrandTemplateSelectionModal,
  BrandTemplatesStack,
  CampaignNameInput,
  CanvaIcon,
  DemoButton,
  DiscountSelector,
  FormPaper,
  SingleProductSelector,
} from "src/components";
import { useCampaignContext } from "src/context";

export const MultipleDesignsCampaignForm = ({
  isLoading,
  brandTemplates,
  onCreate,
}: {
  isLoading: boolean;
  brandTemplates: BrandTemplate[];
  onCreate: () => void;
}) => {
  const { campaignName, selectedProduct, selectedBrandTemplates } =
    useCampaignContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack spacing={4}>
      <CampaignNameInput disabled={isLoading} />
      <FormPaper>
        <Stack spacing={4} marginBottom={4}>
          <Typography variant="h5" marginBottom={4}>
            Select product details
          </Typography>
          <SingleProductSelector disabled={isLoading} />
          <DiscountSelector disabled={isLoading} />
        </Stack>
      </FormPaper>
      <FormPaper>
        <Typography variant="h5">Select brand templates</Typography>
        <Typography variant="body2" marginBottom={2}>
          These templates will be used to create Canva designs featuring the
          product details
        </Typography>
        {selectedBrandTemplates.length ? (
          <Stack spacing={2}>
            <BrandTemplatesStack />
            <DemoButton
              demoVariant="secondary"
              startIcon={<CanvaIcon />}
              onClick={() => setIsOpen(true)}
              disabled={!selectedProduct || isLoading}
              fullWidth={true}
            >
              EDIT SELECTION
            </DemoButton>
            <DemoButton
              demoVariant="primary"
              onClick={onCreate}
              disabled={!selectedProduct || !campaignName}
              loading={isLoading}
              startIcon={<CanvaIcon />}
              fullWidth={true}
            >
              GENERATE CANVA DESIGNS
            </DemoButton>
          </Stack>
        ) : (
          <DemoButton
            demoVariant="secondary"
            startIcon={<CanvaIcon />}
            onClick={() => setIsOpen(true)}
            disabled={!selectedProduct}
            loading={!brandTemplates.length}
            fullWidth={true}
          >
            TEMPLATE SELECTION
          </DemoButton>
        )}
      </FormPaper>
      <BrandTemplateSelectionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        brandTemplates={brandTemplates}
      />
    </Stack>
  );
};
