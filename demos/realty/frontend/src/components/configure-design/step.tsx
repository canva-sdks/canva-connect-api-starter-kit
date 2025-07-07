import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  Chip,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";
import type { Broker, Property } from "@realty-demo/shared-models";
import { SelectWithPreview } from "./select-with-preview";

type StepProps = {
  title: string;
  stepNumber: number;
  disabled?: boolean;
  children: React.ReactNode;
};

const Step = ({ title, stepNumber, disabled = false, children }: StepProps) => (
  <Box sx={{ mb: 3, opacity: disabled ? 0.6 : 1 }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      Step {stepNumber}: {title}
    </Typography>
    {children}
  </Box>
);

type PropertyStepProps = {
  properties: Property[];
  selectedPropertyId: number | "";
  onPropertyChange: (propertyId: number) => void;
  disabled?: boolean;
};

export const PropertyStep = ({
  properties,
  selectedPropertyId,
  onPropertyChange,
  disabled = false,
}: PropertyStepProps) => {
  const propertyOptions = properties.map((property) => ({
    id: property.id,
    title: property.address,
    imageUrl: property.imageUrls?.[0],
  }));

  return (
    <Step title="Choose a property" stepNumber={3} disabled={disabled}>
      <SelectWithPreview
        label="Select a property"
        value={selectedPropertyId}
        options={propertyOptions}
        onChange={(value) => onPropertyChange(value as number)}
        imageVariant="rounded"
        disabled={disabled}
      />
    </Step>
  );
};

type AgentStepProps = {
  brokers: Broker[];
  selectedBrokerIds: number[];
  onBrokerChange: (brokerIds: number[]) => void;
  disabled?: boolean;
  requiredAgentCount?: number;
};

export const AgentStep = ({
  brokers,
  selectedBrokerIds,
  onBrokerChange,
  disabled,
  requiredAgentCount = 1,
}: AgentStepProps) => {
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    // Handle both array values and empty selections
    if (Array.isArray(value)) {
      onBrokerChange(value);
    } else if (value === "") {
      onBrokerChange([]);
    }
  };

  const getStepTitle = () => {
    if (requiredAgentCount === 1) {
      return "Select an agent";
    } else if (requiredAgentCount === 2) {
      return "Select two agents";
    }
    return "Select agents (Max 2)";
  };

  return (
    <Step title={getStepTitle()} stepNumber={2} disabled={disabled}>
      <FormControl fullWidth={true}>
        <InputLabel>{getStepTitle()}</InputLabel>
        <Select
          multiple={true}
          value={selectedBrokerIds}
          label={getStepTitle()}
          onChange={handleChange}
          disabled={disabled}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as number[]).map((value) => {
                const broker = brokers.find((b) => b.id === value);
                return (
                  <Chip
                    key={value}
                    avatar={<Avatar src={broker?.imageUrl} />}
                    label={broker?.name}
                    sx={{ m: 0.5 }}
                  />
                );
              })}
            </Box>
          )}
        >
          {brokers.map((broker) => (
            <MenuItem
              key={broker.id}
              value={broker.id}
              sx={{ py: 1 }}
              disabled={
                selectedBrokerIds.length >= requiredAgentCount &&
                !selectedBrokerIds.includes(broker.id)
              }
            >
              <Avatar
                src={broker.imageUrl}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Typography>{broker.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Step>
  );
};

type TemplateStepProps = {
  templates: BrandTemplate[];
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  disabled?: boolean;
};

export const TemplateStep = ({
  templates,
  selectedTemplateId,
  onTemplateChange,
  disabled,
}: TemplateStepProps) => {
  const templateOptions = templates.map((template) => ({
    id: template.id,
    title: template.title || "Untitled Template",
    imageUrl: template.thumbnail?.url,
  }));

  return (
    <Step title="Pick a template" stepNumber={1} disabled={disabled}>
      <SelectWithPreview
        label="Select a Brand Template"
        value={selectedTemplateId}
        options={templateOptions}
        onChange={(value) => onTemplateChange(value as string)}
        disabled={disabled}
        imageVariant="rounded"
      />
    </Step>
  );
};
