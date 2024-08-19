import { Check } from "@mui/icons-material";
import type { StepIconProps } from "@mui/material";
import {
  Box,
  CircularProgress,
  CssBaseline,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "src/components";
import { useAppContext } from "src/context";
import type { CorrelationState } from "src/models";
import { EditInCanvaPageOrigins } from "src/models";
import { Paths } from "src/routes";
import {
  downloadExportedImage,
  exportDesign,
  fetchDesign,
  getDesign,
  getProducts,
} from "src/services";
import { decodeCorrelationState } from "src/services/canva-return";

const STEPS = [
  {
    label: "Kick off return to Nourish.",
    description:
      "Starting return processing, reading query parameters, parsing correlation state.",
  },
  {
    label: "Fetch updated design.",
    description: "Fetching the updated design from Canva.",
  },
  {
    label: "Export updated design.",
    description: "Exporting a high-res updated design from Canva.",
  },
  {
    label: "Return to starting page.",
    description: "",
  },
];

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.background.paper,
    opacity: 1,
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: theme.palette.primary.main,
    }),
    "& .StepIcon-completedIcon": {
      color: theme.palette.primary.main,
      zIndex: 1,
      fontSize: 26,
    },
    "& .StepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  }),
);

function StepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot
      ownerState={{ active }}
      className={className}
      sx={{
        display: "flex",
        placeContent: "center",
        width: "45px",
        height: "45px",
        marginLeft: "-10px",
      }}
    >
      {completed ? (
        <Check className="StepIcon-completedIcon" />
      ) : active ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <div className="StepIcon-circle" />
      )}
    </StepIconRoot>
  );
}

export const ReturnNavPage = (): JSX.Element => {
  const {
    addAlert,
    setCreatedSingleDesign,
    setSelectedCampaignProduct,
    setMarketingMultiDesignResults,
  } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams(); // ?design_id=aaaaa&correlation_state=bbbbb
  const designId = searchParams.get("design_id");
  const correlationStateStr = searchParams.get("correlation_state");

  useEffect(() => {
    if (!designId || !correlationStateStr) {
      addAlert({
        title:
          "Unable to process return (design or correlation_state undetected).",
        variant: "error",
        hideAfterMs: 6000,
      });
      navigate(Paths.HOME);
    }
  }, [designId, correlationStateStr]);

  if (!designId || !correlationStateStr) {
    return (
      <Box padding={12}>
        <NavBar />
        <Typography variant="h3">
          Something went wrong processing the return.
        </Typography>
      </Box>
    );
  }

  const parsedCorrelationState = JSON.parse(
    decodeCorrelationState(correlationStateStr),
  ) as CorrelationState | undefined;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const fetchAndExportUpdatedDesign = async () => {
    try {
      const fetchDesignResult = await fetchDesign({ designId });
      handleNext(); // move from "Get Design" to "Export Design".

      const designExportJobResponse = await exportDesign({ designId });

      // Next we yield the first url that is defined, since an export can have multiple pages and the service here only exports the first page
      const exportedDesignUrl = designExportJobResponse.job.urls?.find(
        (url) => url !== undefined,
      );

      if (!exportedDesignUrl || !parsedCorrelationState) {
        throw new Error("Something went exporting the design.");
      }

      const { downloadedExportUrl } = await downloadExportedImage({
        exportedDesignUrl,
        // Only send productId if the origin page was "/products" so that the
        // corresponding product has it's exportUrl updated accordingly in the db.
        productId:
          parsedCorrelationState?.originPage === EditInCanvaPageOrigins.PRODUCT
            ? parsedCorrelationState?.originProductId
            : undefined,
      });

      handleNext(); // Move from "EXPORT" to "REDIRECT".

      switch (parsedCorrelationState.originPage) {
        /**
         * Case 1 - In the case of originally starting from a product simply add an alert
         */
        case EditInCanvaPageOrigins.PRODUCT: {
          addAlert({
            title: `Edits to ${fetchDesignResult.design.title ?? "Product"} were saved!`,
            variant: "success",
            hideAfterMs: 6000,
          });
          break;
        }

        /**
         * Case 2 - In the case of originally starting from a single design marketing page:
         *  2a) Update the selectedCampaignProduct from correlation_state: originProductId.
         *  2b) Update the createdSingleDesign with the fetched design the user returned from.
         *  2c) Finally add an alert with the updated design title.
         */
        case EditInCanvaPageOrigins.MARKETING_SINGLE: {
          const getProductsResult = await getProducts();
          const originalSelectedProduct = getProductsResult.products.find(
            (p) => p.id === parsedCorrelationState.originProductId,
          );
          setSelectedCampaignProduct(originalSelectedProduct);
          setCreatedSingleDesign({
            ...fetchDesignResult.design,
            // Updating the design thumbnail to match the downloadedExport since thumbnails
            // are not updated immediately.
            thumbnail: { url: downloadedExportUrl, width: 1000, height: 1000 },
          });
          addAlert({
            title: `Edits to ${fetchDesignResult.design.title ?? "Campaign"} were saved!`,
            variant: "success",
            hideAfterMs: 6000,
          });
          break;
        }

        /**
         * Case 3 - In the case of originally starting from a multi-design marketing page:
         *  3a) Update the selectedCampaignProduct from correlation_state: originProductId.
         *  3b) For each multiDesignId in the correlation_state fetch the design.
         *  3c) Update marketingMultiDesignResults based on the fetched designs and override
         *      the design thumbnail that the user returned from with the downloadedExportUrl.
         *  3d) Finally add an alert with the updated design title.
         */
        case EditInCanvaPageOrigins.MARKETING_MULTI: {
          if (!parsedCorrelationState.originMarketingMultiDesignIds) {
            throw new Error("Unable to fetch designs for multi-design return.");
          }

          const getProductsResult = await getProducts();
          const originalSelectedProduct = getProductsResult.products.find(
            (p) => p.id === parsedCorrelationState.originProductId,
          );
          setSelectedCampaignProduct(originalSelectedProduct);

          const designPromises =
            parsedCorrelationState.originMarketingMultiDesignIds.map((id) =>
              getDesign(id),
            );
          const results = await Promise.allSettled(designPromises);

          if (results.every((result) => result.status !== "fulfilled")) {
            throw new Error("Something went fetching the designs.");
          }

          results.forEach((result) => {
            if (result.status === "fulfilled") {
              setMarketingMultiDesignResults((currentResults) => [
                ...currentResults,
                {
                  ...result.value.design,
                  thumbnail:
                    // Updating the design thumbnail to match the downloadedExport if the current design matches
                    // the fetched design the user returned from since thumbnails are not updated immediately.
                    result.value.design.id === fetchDesignResult.design.id
                      ? { url: downloadedExportUrl, width: 1000, height: 1000 }
                      : result.value.design.thumbnail,
                },
              ]);
            }
          });

          addAlert({
            title: `Edits to ${fetchDesignResult.design.title ?? "Campaign"} were saved!`,
            variant: "success",
            hideAfterMs: 6000,
          });
          break;
        }

        default: {
          throw new Error("Undetected Edit in Canva starting origin.");
        }
      }

      /**
       * Note: this timeout is added to slow down the Return Nav page just a little for demo
       * purposes to show what is happening. This is up to your own implementation how you
       * prefer the user experience to flow and/or how many steps you perform on the return page.
       */
      setTimeout(() => {
        handleNext(); // Move from "REDIRECT" to "COMPLETE".
        navigate(parsedCorrelationState.originPage);
      }, 1000);
    } catch (error) {
      console.error(error);
      addAlert({
        title: "Something went wrong processing the updated design.",
        variant: "error",
      });
      navigate(parsedCorrelationState?.originPage ?? Paths.HOME);
    }
  };

  useEffect(() => {
    // Step 1 - Initialize mount:
    handleNext();

    // Step 2/3/4 - Fetch Design, Export Design and Redirect:
    fetchAndExportUpdatedDesign();
  }, []);

  return (
    <Box display="flex" paddingTop={12} sx={{ placeContent: "center" }}>
      <CssBaseline />
      <NavBar />
      <Box sx={{ width: 600 }} paddingY={8} paddingLeft={8}>
        <Box display="flex" justifyContent="start">
          <Typography fontSize={24} fontWeight={600}>
            Processing Return
          </Typography>
        </Box>

        <Box paddingTop={3} sx={{ maxHeight: "700px" }}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            connector={<Connector />}
          >
            {STEPS.map((step, index) => (
              <Step key={step.label} expanded={true}>
                <StepLabel
                  StepIconComponent={StepIcon}
                  sx={{ opacity: activeStep >= index ? "1" : "0.4" }}
                >
                  <Typography fontSize={18} fontWeight={600}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    textAlign: "left",
                    paddingLeft: "30px",
                    color: (theme) => theme.palette.secondary.main,
                    opacity: activeStep >= index ? "1" : "0.4",
                    borderLeftColor: (theme) =>
                      activeStep >= index
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                  }}
                >
                  <Typography>{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    </Box>
  );
};
