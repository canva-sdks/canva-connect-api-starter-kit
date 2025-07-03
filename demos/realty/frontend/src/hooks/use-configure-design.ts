import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "src/context";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import type { Broker, Property } from "@realty-demo/shared-models";
import { exportDesign } from "src/services";
import { autoFillTemplate } from "src/services/autofill";
import type {
  FieldMappingError,
  FieldMapping,
} from "src/services/field-mapping-validation";
import { validateFieldMappings } from "src/services/field-mapping-validation";

type UseConfigureDesignProps = {
  brandTemplates: BrandTemplate[];
  brokers: Broker[];
  properties: Property[];
};

export const useConfigureDesign = ({
  brandTemplates,
  brokers,
  properties,
}: UseConfigureDesignProps) => {
  const { addAlert } = useAppContext();
  const location = useLocation();

  // Check if we have pre-selected values from navigation state
  const preSelectedTemplateId =
    (location.state as { templateId?: string })?.templateId || "";
  const preSelectedPropertyId =
    (location.state as { propertyId?: number })?.propertyId || "";
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    preSelectedTemplateId,
  );
  const [selectedBrokerIds, setSelectedBrokerIds] = useState<number[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | "">(
    preSelectedPropertyId,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "loading" | "error" | "success" | null;
    loadingStep?: "validating" | "generating" | "exporting";
  }>({
    isOpen: false,
    type: null,
  });
  const [fieldMappingErrors, setFieldMappingErrors] = useState<
    FieldMappingError[]
  >([]);
  const [generatedDesign, setGeneratedDesign] = useState<{
    id: string;
    editUrl: string;
    thumbnailUrls: string[];
  } | null>(null);

  // Derived state
  const selectedProperty =
    typeof selectedPropertyId === "number"
      ? properties.find((p) => p.id === selectedPropertyId)
      : undefined;
  const selectedTemplate = brandTemplates.find(
    (t) => t.id === selectedTemplateId,
  );

  // Get required agent count from selected template
  const templateTitle = selectedTemplate?.title?.toLowerCase() || "";
  const requiredAgentCount = templateTitle.includes("double agent") ? 2 : 1;

  const isTemplateSelected = selectedTemplateId !== "";
  const isAgentsSelected = selectedBrokerIds.length >= requiredAgentCount;
  const isPropertySelected =
    typeof selectedPropertyId === "number" && selectedPropertyId > 0;
  const canGenerate =
    isTemplateSelected && isAgentsSelected && isPropertySelected;

  // All templates are available for selection (no filtering needed)
  const filteredTemplates = brandTemplates;

  // Handlers
  const handleMappingComplete = React.useCallback(
    async (mappings: FieldMapping[]) => {
      if (!selectedProperty || !selectedTemplate) {
        addAlert({
          title: "Missing required selections",
          variant: "error",
        });
        return;
      }

      try {
        const result = await autoFillTemplate({
          brandTemplateId: selectedTemplate.id,
          property: selectedProperty,
          fieldMappings: mappings,
          brokers: brokers.filter((b) => selectedBrokerIds.includes(b.id)),
        });

        if (!result.job.result?.design.id) {
          throw new Error("Failed to generate design");
        }

        // Update to exporting step
        setModalState({
          isOpen: true,
          type: "loading",
          loadingStep: "exporting",
        });

        const exportJobResult = await exportDesign({
          designId: result.job.result.design.id,
          fileType: "JPG",
        });

        const exportedDesignUrls = exportJobResult.job.urls?.filter(
          (url) => url !== undefined,
        );

        if (!exportedDesignUrls || exportedDesignUrls.length === 0) {
          throw new Error("Failed to export design");
        }

        setGeneratedDesign({
          id: result.job.result.design.id,
          editUrl: result.job.result.design.urls.edit_url,
          thumbnailUrls: exportedDesignUrls,
        });

        // Show success modal
        setModalState({
          isOpen: true,
          type: "success",
        });
      } catch (error) {
        console.error("Error in handleMappingComplete:", error);
        // Hide modal and show error alert
        setModalState({ isOpen: false, type: null });
        addAlert({
          title: "Failed to generate design",
          variant: "error",
        });
      } finally {
        // Modal is closed by the component itself
      }
    },
    [
      selectedProperty,
      selectedTemplate,
      selectedBrokerIds,
      brokers,
      requiredAgentCount,
      addAlert,
    ],
  );

  const handleBrokerChange = React.useCallback((brokerIds: number[]) => {
    setSelectedBrokerIds(brokerIds);
  }, []);

  const handleGenerateClick = React.useCallback(async () => {
    if (!selectedProperty || !selectedTemplate) {
      addAlert({
        title: "Missing required selections",
        variant: "error",
      });
      return;
    }

    try {
      // Show loading modal immediately
      setModalState({
        isOpen: true,
        type: "loading",
        loadingStep: "validating",
      });
      setIsGenerating(true);

      // Validate field mappings first
      const validationResult = await validateFieldMappings(selectedTemplate, {
        property: selectedProperty,
        requiredAgentCount,
      });

      if (!validationResult.isValid) {
        // Show error modal with specific errors
        setFieldMappingErrors(validationResult.errors);
        setModalState({
          isOpen: true,
          type: "error",
        });
        return;
      }

      // If validation passes, proceed with generation
      setModalState({
        isOpen: true,
        type: "loading",
        loadingStep: "generating",
      });
      await handleMappingComplete(validationResult.mappings);
    } catch (error) {
      console.error("Field validation error:", error);
      setModalState({ isOpen: false, type: null });
      addAlert({
        title: "Failed to validate template fields",
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    selectedProperty,
    selectedTemplate,
    requiredAgentCount,
    addAlert,
    handleMappingComplete,
  ]);

  return {
    // Data
    brandTemplates,
    brokers,
    properties,
    filteredTemplates,

    // Selected state
    selectedTemplateId,
    selectedBrokerIds,
    selectedPropertyId,
    selectedProperty,
    selectedTemplate,

    // UI state
    isGenerating,
    modalState,
    fieldMappingErrors,
    generatedDesign,

    // Derived state
    isTemplateSelected,
    isAgentsSelected,
    isPropertySelected,
    canGenerate,
    hasPreSelectedTemplate: !!preSelectedTemplateId,
    hasPreSelectedProperty: !!preSelectedPropertyId,
    requiredAgentCount,

    // Setters
    setSelectedTemplateId,
    setSelectedPropertyId,
    setModalState,

    // Handlers
    handleBrokerChange,
    handleGenerateClick,
    handleMappingComplete,
  };
};
