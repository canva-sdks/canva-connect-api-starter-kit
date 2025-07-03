import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Error } from "@mui/icons-material";
import { useEffect, useCallback, useState } from "react";
import { Paths } from "src/routes/routes";
import { type FlyerDesign } from "@realty-demo/shared-models";
import { downloadExportedImage, saveFlyer } from "src/services";
import { CanvaIcon, DemoButton, ImageCarousel } from "..";
import { LoadingContent } from "./loading-content";
import type { FieldMappingError } from "../../services/field-mapping-validation";
import { useOpenInCanva } from "../../hooks/use-open-in-canva";
import { EditInCanvaPageOrigins } from "src/pages/return-nav";

type GeneratedDesign = {
  id: string;
  editUrl: string;
  thumbnailUrls: string[];
};

type ConfigureDesignModalProps = {
  isOpen: boolean;
  onClose: () => void;

  // Modal state
  modalType: "loading" | "error" | "success" | null;

  // Loading state
  loadingStep?: "validating" | "generating" | "exporting";

  // Error state
  errors?: FieldMappingError[];
  templateName?: string;

  // Success state
  generatedDesign?: GeneratedDesign;
  propertyAddress?: string;
  propertyId?: number;
  brokerId?: number;
};

const ErrorContent = ({
  errors,
  templateName,
  onClose,
}: {
  errors: FieldMappingError[];
  templateName?: string;
  onClose: () => void;
}) => (
  <Box>
    <Box display="flex" alignItems="center" mb={2}>
      <Error color="error" sx={{ mr: 1 }} />
      <Typography variant="h6">Template Field Mapping Issues</Typography>
    </Box>

    <Alert severity="error" sx={{ mb: 3 }}>
      The template "{templateName}" has some field mapping issues that need to
      be resolved.
    </Alert>

    <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
      {errors.map((error, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            p: 2,
            border: 1,
            borderColor: "grey.300",
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
            {error.field}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.reason}
          </Typography>
        </Box>
      ))}
    </Box>

    <Box mt={3} display="flex" justifyContent="flex-end">
      <DemoButton demoVariant="secondary" onClick={onClose}>
        Close
      </DemoButton>
    </Box>
  </Box>
);

const SuccessContent = ({
  generatedDesign,
  propertyAddress,
  propertyId,
  brokerId,
  onViewDesigns,
}: {
  generatedDesign: GeneratedDesign;
  propertyAddress?: string;
  propertyId?: number;
  brokerId?: number;
  onViewDesigns: () => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [flyerId, setFlyerId] = useState<string | undefined>(undefined);

  const { openInCanva } = useOpenInCanva({
    originPage: EditInCanvaPageOrigins.CONFIGURE_DESIGN,
    returnTo: Paths.DESIGNS,
  });

  useEffect(() => {
    return () => {
      setFlyerId(undefined);
    };
  }, [generatedDesign]);

  /**
   * Saves the design to the database as a flyer
   */
  const handleSaveDesign = useCallback(async (): Promise<void> => {
    if (!propertyId || !brokerId) {
      return;
    }

    setIsSaving(true);
    try {
      const flyerData: Omit<FlyerDesign, "id"> = {
        designId: generatedDesign.id,
        designEditUrl: generatedDesign.editUrl,
        title: propertyAddress || `Design ${generatedDesign.id}`,
        propertyId,
        brokerId,
        thumbnailUrls: generatedDesign.thumbnailUrls,
        createdAt: new Date().toISOString(),
      };

      const { downloadedExportUrls } = await downloadExportedImage({
        exportedDesignUrls: generatedDesign.thumbnailUrls,
        flyerId: generatedDesign.id,
      });

      const { flyer } = await saveFlyer({
        ...flyerData,
        thumbnailUrls: downloadedExportUrls,
      });

      setFlyerId(flyer.id);
    } catch (error) {
      console.error("Failed to save design:", error);
    } finally {
      setIsSaving(false);
    }
  }, [generatedDesign, propertyAddress, propertyId, brokerId]);

  // Save design to database when component mounts
  useEffect(() => {
    handleSaveDesign();
  }, [handleSaveDesign]);

  return (
    <Box textAlign="center">
      <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />

      <Typography variant="h5" sx={{ mb: 1 }}>
        Design generated successfully!
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Your design for {propertyAddress} is ready.
      </Typography>

      {generatedDesign.thumbnailUrls.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <ImageCarousel
              alt={`Design preview ${generatedDesign.id}`}
              images={generatedDesign.thumbnailUrls}
              objectFit="contain"
              height={250}
            />
          </Box>
        </Box>
      )}

      <DialogActions sx={{ justifyContent: "center" }}>
        <DemoButton
          demoVariant="primary"
          startIcon={<CanvaIcon />}
          disabled={!flyerId}
          onClick={() => {
            if (!flyerId) {
              return;
            }

            openInCanva({
              id: flyerId,
              editUrl: generatedDesign.editUrl,
            });
          }}
        >
          Open in Canva
        </DemoButton>
        <DemoButton
          demoVariant="primaryOutlined"
          onClick={onViewDesigns}
          disabled={isSaving}
        >
          View my designs
        </DemoButton>
      </DialogActions>
    </Box>
  );
};

export const ConfigureDesignModal = ({
  isOpen,
  onClose,
  modalType,
  loadingStep,
  errors = [],
  templateName,
  generatedDesign,
  propertyAddress,
  propertyId,
  brokerId,
}: ConfigureDesignModalProps) => {
  const navigate = useNavigate();

  const handleViewDesigns = () => {
    onClose();
    navigate(Paths.DESIGNS);
  };

  const renderContent = () => {
    switch (modalType) {
      case "loading":
        return loadingStep ? <LoadingContent step={loadingStep} /> : null;

      case "error":
        return (
          <ErrorContent
            errors={errors}
            templateName={templateName}
            onClose={onClose}
          />
        );

      case "success":
        return generatedDesign ? (
          <SuccessContent
            generatedDesign={generatedDesign}
            propertyAddress={propertyAddress}
            propertyId={propertyId}
            brokerId={brokerId}
            onViewDesigns={handleViewDesigns}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={modalType !== "loading" ? onClose : undefined}
      maxWidth="sm"
      fullWidth={true}
      disableEscapeKeyDown={modalType === "loading"}
    >
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
};
