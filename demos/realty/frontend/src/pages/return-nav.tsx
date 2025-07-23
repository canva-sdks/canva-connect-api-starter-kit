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
import { useAppContext } from "src/context";
import { Paths } from "src/routes";
import {
  downloadExportedImage,
  exportDesign,
  getDesign,
  updateFlyer,
} from "src/services";
import { decodeCorrelationState } from "src/services/canva-return";

export enum EditInCanvaPageOrigins {
  DESIGNS = "/designs",
  CONFIGURE_DESIGN = "/configure-design",
}

export type CorrelationState = {
  originPage: EditInCanvaPageOrigins;
  originPropertyId?: number;
  originMarketingMultiDesignIds?: string[];
  returnTo?: string;
  flyerId?: string;
};

const STEPS = [
  {
    label: "Kick off return to Brix & Hart.",
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
  const { addAlert } = useAppContext();
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
      navigate(Paths.ROOT);
    }
  }, [designId, correlationStateStr]);

  if (!designId || !correlationStateStr) {
    return (
      <Box padding={12}>
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
      const designResult = await getDesign(designId);
      handleNext(); // move from "Get Design" to "Export Design".

      const designExportJobResponse = await exportDesign({
        designId,
        fileType: "JPG",
      });

      // Next we yield the first url that is defined, since an export can have multiple pages and the service here only exports the first page
      const exportedDesignUrls = designExportJobResponse.job.urls?.filter(
        (url) => url !== undefined,
      );

      if (!exportedDesignUrls || !parsedCorrelationState) {
        throw new Error("Something went exporting the design.");
      }

      const { downloadedExportUrls } = await downloadExportedImage({
        exportedDesignUrls,
        flyerId: parsedCorrelationState?.flyerId,
      });

      handleNext(); // Move from "EXPORT" to "REDIRECT".

      switch (parsedCorrelationState.originPage) {
        case EditInCanvaPageOrigins.DESIGNS:
        case EditInCanvaPageOrigins.CONFIGURE_DESIGN:
          const flyerId = parsedCorrelationState.flyerId;
          if (!flyerId) {
            throw new Error("Flyer ID not found in correlation state.");
          }

          await updateFlyer(flyerId, {
            thumbnailUrls: downloadedExportUrls,
          });

          // No specific action needed here as the final navigate handles it
          console.log("Return Nav: DESIGNS origin processed.");
          addAlert({
            // Add an alert for confirmation
            title: `Edits to ${designResult.design.title ?? "Design"} were saved!`,
            variant: "success",
            hideAfterMs: 6000,
          });
          break;
        default:
          // This should ideally not be reached now for the DESIGNS case
          const error: never = parsedCorrelationState.originPage;
          throw new Error(`Undetected Edit in Canva starting origin: ${error}`);
      }

      /**
       * Note: this timeout is added to slow down the Return Nav page just a little for demo
       * purposes to show what is happening. This is up to your own implementation how you
       * prefer the user experience to flow and/or how many steps you perform on the return page.
       */
      setTimeout(() => {
        handleNext(); // Move from "REDIRECT" to "COMPLETE".
        // Prioritize returnTo if available, otherwise use originPage
        const finalRedirectPath =
          parsedCorrelationState.returnTo || parsedCorrelationState.originPage;
        navigate(finalRedirectPath);
      }, 1000);
    } catch (error) {
      console.error(error);
      addAlert({
        title: "Something went wrong processing the return.",
        variant: "error",
      });
      navigate(Paths.ROOT);
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
                    color: "#9e9e9e",
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
