import { useEffect, useState } from "react";
import type {
  BrandTemplate,
  GetDesignAutofillJobResponse,
} from "@canva/connect-api-ts/types.gen";
import { Grid, Stack, Typography } from "@mui/material";
import {
  AutofillResults,
  GeneratingDesignsDialog,
  MultipleDesignsCampaignForm,
  PageDescriptor,
  PublishCampaignButtons,
  PublishDialog,
} from "src/components";
import { useAppContext, useCampaignContext } from "src/context";
import { autoFillTemplateWithProduct, getBrandTemplates } from "src/services";

export const MultipleDesignsGeneratorPage = () => {
  const { setErrors } = useAppContext();
  const {
    campaignName,
    selectedProduct,
    selectedDiscount,
    selectedBrandTemplates,
    setSelectedBrandTemplates,
  } = useCampaignContext();
  const [brandTemplates, setBrandTemplates] = useState<BrandTemplate[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState<number>();
  const [autoFillResults, setAutoFillResults] = useState<
    GetDesignAutofillJobResponse[]
  >([]);
  const [loadingModalIsOpen, setLoadingModalIsOpen] = useState(false);
  const [publishDialogIsOpen, setPublishDialogIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const { items } = await getBrandTemplates();
        setBrandTemplates(items);
      } catch (e) {
        setErrors((prevState) =>
          prevState.concat(
            "Something went wrong fetching your brand templates.",
          ),
        );
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
    setSelectedBrandTemplates([]);
  }, []);

  const autofillSelectedBrandTemplates = async () => {
    try {
      if (!selectedProduct) {
        setErrors((prevState) => prevState.concat("No product selected."));
        return;
      }

      if (!selectedBrandTemplates.length) {
        setErrors((prevState) =>
          prevState.concat("No brand templates selected."),
        );
        return;
      }

      const autoFillPromises = selectedBrandTemplates.map((brandTemplate) =>
        autoFillTemplateWithProduct({
          brandTemplateId: brandTemplate.id,
          product: selectedProduct,
          discount: selectedDiscount,
        }),
      );

      const results = await Promise.allSettled(autoFillPromises);

      results.forEach((result) => {
        if (result.status === "rejected") {
          setErrors((prevState) =>
            prevState.concat(`Error creating design: ${result.reason}`),
          );
        } else if (result.status === "fulfilled") {
          setAutoFillResults((prevResults) => [...prevResults, result.value]);
        }
      });
    } catch (error) {
      setErrors((prevState) => prevState.concat(`Unexpected error: ${error}`));
    }
  };

  const onCreate = async () => {
    const baseEstimatedTime = 8000; // base time regardless of number of templates
    const additionalTimePerTemplate = 1000; // additional time per template

    const numberOfTemplates = selectedBrandTemplates.length;
    const estimatedTotalTime =
      baseEstimatedTime + additionalTimePerTemplate * numberOfTemplates;

    setLoadingModalIsOpen(true);
    setProgress(0);

    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const estimatedProgress = (elapsedTime / estimatedTotalTime) * 100;

      setProgress(Math.min(100, estimatedProgress));

      if (elapsedTime >= estimatedTotalTime) {
        clearInterval(intervalId);
      }
    }, 100);

    try {
      await autofillSelectedBrandTemplates();
    } catch (error) {
      setErrors((prevState) => prevState.concat("Error auto-filling template"));
    } finally {
      clearInterval(intervalId);
      setLoadingModalIsOpen(false);
      setProgress(undefined);
    }
  };

  if (!isFetching && !brandTemplates?.length) {
    return (
      <Typography variant="h4" gutterBottom={true}>
        Looks like you don't have any brand templates!
      </Typography>
    );
  }

  return (
    <Grid container={true} spacing={3} marginBottom={4}>
      <PageDescriptor
        title="Multiple Designs"
        description="Create multiple designs at once by adding products to your Brand Templates"
      />
      <Grid item={true} xs={8}>
        {autoFillResults.length ? (
          <Stack spacing={4}>
            <AutofillResults autoFillResults={autoFillResults} />
            <PublishCampaignButtons
              onCancel={() => setAutoFillResults([])}
              onPublish={() => {
                if (campaignName) {
                  setPublishDialogIsOpen(true);
                }
              }}
              publishDisabled={!campaignName}
            />
          </Stack>
        ) : (
          <MultipleDesignsCampaignForm
            isLoading={loadingModalIsOpen}
            brandTemplates={brandTemplates}
            onCreate={onCreate}
          />
        )}
      </Grid>
      <GeneratingDesignsDialog
        isOpen={loadingModalIsOpen}
        progress={progress}
      />
      <PublishDialog
        isOpen={publishDialogIsOpen}
        onOpenChange={setPublishDialogIsOpen}
      />
    </Grid>
  );
};
