import { Alert, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  PageHeader,
  DemoButton,
  CanvaIcon,
  ConfigureDesignModal,
  ConnectButton,
} from "src/components";
import {
  PropertyStep,
  AgentStep,
  TemplateStep,
} from "src/components/configure-design";
import { useConfigureDesign } from "src/hooks/use-configure-design";
import { useAppContext } from "src/context";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import type { Broker, Property } from "@realty-demo/shared-models";
import { getBrokers, getProperties, getBrandTemplates } from "src/services";

export const ConfigureDesignPage = () => {
  const { addAlert, isAuthorized } = useAppContext();

  // Data state
  const [brandTemplates, setBrandTemplates] = useState<BrandTemplate[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [templatesRes, brokersRes, propertiesRes] = await Promise.all([
          getBrandTemplates(),
          getBrokers(),
          getProperties(),
        ]);

        if (templatesRes.items) {
          setBrandTemplates(templatesRes.items);
        }
        if (brokersRes.brokers) {
          setBrokers(brokersRes.brokers);
        }
        if (propertiesRes.properties) {
          setProperties(propertiesRes.properties);
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Failed to load configuration options",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchData();
    }
  }, [addAlert, isAuthorized]);

  const hookData = useConfigureDesign({ brandTemplates, brokers, properties });

  const {
    // Data
    filteredTemplates,

    // Selected state
    selectedPropertyId,
    selectedBrokerIds,
    selectedTemplateId,

    // UI state
    isGenerating,

    // Derived state
    isTemplateSelected,
    isAgentsSelected,
    canGenerate,
    requiredAgentCount,

    // Setters
    setSelectedTemplateId,
    setSelectedPropertyId,

    // Handlers
    handleBrokerChange,
    handleGenerateClick,
  } = hookData;

  // Early return for unauthorized users
  if (!isAuthorized) {
    return (
      <Box paddingY={2}>
        <PageHeader title="Create a Canva design" />
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" action={<ConnectButton />} sx={{ mb: 2 }}>
            <Typography variant="body1">
              Connect to Canva to create a Canva design
            </Typography>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box paddingY={2}>
      <PageHeader title="Configure design" />
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 400, color: "#073555" }}
      >
        Choose the content and style for your Canva design
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 600, mt: 4 }}>
        {!isLoading && (
          <>
            <TemplateStep
              templates={filteredTemplates}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={(templateId) => {
                setSelectedTemplateId(templateId);
                handleBrokerChange([]);
              }}
              disabled={false}
            />

            <AgentStep
              brokers={brokers}
              selectedBrokerIds={selectedBrokerIds}
              onBrokerChange={handleBrokerChange}
              disabled={!isTemplateSelected}
              requiredAgentCount={requiredAgentCount}
            />

            <PropertyStep
              properties={properties}
              selectedPropertyId={selectedPropertyId}
              onPropertyChange={setSelectedPropertyId}
              disabled={!isAgentsSelected}
            />

            <DemoButton
              demoVariant="primary"
              startIcon={<CanvaIcon />}
              onClick={handleGenerateClick}
              disabled={!canGenerate}
              loading={isGenerating}
              fullWidth={true}
              sx={{ mt: 1 }}
            >
              Generate with Canva
            </DemoButton>
          </>
        )}
      </Box>
      <StatusModal hookData={hookData} />
    </Box>
  );
};

interface StatusModalProps {
  hookData: ReturnType<typeof useConfigureDesign>;
}

export const StatusModal = ({ hookData }: StatusModalProps) => {
  const {
    modalState,
    setModalState,
    fieldMappingErrors,
    generatedDesign,
    selectedProperty,
    selectedTemplate,
    selectedBrokerIds,
  } = hookData;

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  return (
    <ConfigureDesignModal
      isOpen={modalState.isOpen}
      onClose={handleCloseModal}
      modalType={modalState.type}
      loadingStep={modalState.loadingStep}
      errors={fieldMappingErrors}
      templateName={selectedTemplate?.title}
      generatedDesign={generatedDesign || undefined}
      propertyAddress={selectedProperty?.address}
      propertyId={selectedProperty?.id}
      brokerId={selectedBrokerIds[0]}
    />
  );
};
