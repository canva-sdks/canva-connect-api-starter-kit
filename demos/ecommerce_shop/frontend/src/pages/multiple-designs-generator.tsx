import { useEffect, useState } from "react";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
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
import {
  autoFillTemplateWithProduct,
  fetchDesign,
  getBrandTemplates,
} from "src/services";

export const MultipleDesignsGeneratorPage = () => {
  const {
    addAlert,
    selectedCampaignProduct,
    marketingMultiDesignResults,
    setMarketingMultiDesignResults,
  } = useAppContext();
  const {
    campaignName,
    selectedDiscount,
    selectedBrandTemplates,
    setSelectedBrandTemplates,
  } = useCampaignContext();
  const [brandTemplates, setBrandTemplates] = useState<BrandTemplate[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState<number>();
  const [loadingModalIsOpen, setLoadingModalIsOpen] = useState(false);
  const [publishDialogIsOpen, setPublishDialogIsOpen] = useState(false);
  const [isFirstGenerated, setIsFirstGenerated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const { items } = await getBrandTemplates();
        setBrandTemplates(items);
      } catch (e) {
        addAlert({
          title: "Something went wrong fetching your brand templates.",
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
    setSelectedBrandTemplates([]);
  }, []);

  const autofillSelectedBrandTemplates = async () => {
    try {
      if (!selectedCampaignProduct) {
        addAlert({ title: "No product selected.", variant: "error" });
        return;
      }

      if (!selectedBrandTemplates.length) {
        addAlert({
          title: "No brand templates selected.",
          variant: "error",
        });
        return;
      }

      const autoFillPromises = selectedBrandTemplates.map((brandTemplate) =>
        autoFillTemplateWithProduct({
          brandTemplateId: brandTemplate.id,
          product: selectedCampaignProduct,
          discount: selectedDiscount,
        }),
      );

      const results = await Promise.allSettled(autoFillPromises);

      results.forEach(async (result) => {
        if (result.status === "rejected") {
          addAlert({
            title: `Error creating design: ${result.reason}.`,
            variant: "error",
          });
        } else if (result.status === "fulfilled") {
          if (result.value.job.result?.design.id) {
            const response = await fetchDesign({
              designId: result.value.job.result.design.id,
            });
            setMarketingMultiDesignResults((currentDesigns) => [
              ...currentDesigns,
              {
                ...response.design,
                /**
                 * A design created from an autoFill request doesn't have a design.thumbnail,
                 * whereas the auto-fill job result does.  Falling back to the job result
                 * thumbnail where design thumbnail is undefined
                 */
                thumbnail:
                  response.design.thumbnail ??
                  result.value.job.result?.design.thumbnail,
              },
            ]);
          }
        }
      });

      setIsFirstGenerated(true);

      addAlert({
        title:
          results.filter((result) => result.status === "fulfilled").length === 1
            ? "1 Canva design was generated"
            : `${results.length} Canva designs were generated`,
        variant: "success",
        hideAfterMs: -1,
      });
    } catch (error) {
      addAlert({
        title: `Unexpected error: ${error}`,
        variant: "error",
      });
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
      console.error(error);
      addAlert({
        title: "Error auto-filling template.",
        variant: "error",
      });
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
        {marketingMultiDesignResults.length ? (
          <Stack spacing={4}>
            <AutofillResults
              designResults={marketingMultiDesignResults}
              firstGenerated={isFirstGenerated}
            />
            <PublishCampaignButtons
              onCancel={() => setMarketingMultiDesignResults([])}
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
