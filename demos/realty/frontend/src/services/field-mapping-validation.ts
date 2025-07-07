import { getBrandTemplateDataset } from "src/services";
import type { Property, Broker } from "@realty-demo/shared-models";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";

type FieldType = "text" | "image" | "chart";

export type FieldMapping = {
  canvaField: string;
  propertyField?: keyof Property;
  brokerField?: keyof Broker;
  imageIndex?: number;
  brokerIndex?: number;
  fieldType: FieldType;
};

export type FieldMappingError = {
  field: string;
  reason: string;
  type:
    | "missing_broker"
    | "missing_broker2"
    | "insufficient_images"
    | "unknown_field"
    | "invalid_field_type"
    | "no_dataset"
    | "missing_field";
};

type FieldMappingConfig = {
  propertyField?: keyof Property;
  brokerField?: keyof Broker;
  imageIndex?: number;
  brokerIndex?: number;
  optional?: boolean;
};

/**
 * Field mapping configuration
 *
 * The keys are the field names in the dataset which must be present on the brand template we're attempting to autofill
 */
export const FIELD_MAPPING_CONFIG: Record<string, FieldMappingConfig> = {
  // Address fields
  addressLine1: { propertyField: "address" },
  addressLine2: { propertyField: "zipCode" },

  // Property details
  description: { propertyField: "description" },
  title: { propertyField: "address" },

  // Property details
  baths: { propertyField: "bathrooms" },
  beds: { propertyField: "bedrooms" },
  cars: { propertyField: "carSpots" },
  price: { propertyField: "price" },

  // Images
  mainImage: { propertyField: "imageUrls", imageIndex: 0 },
  image2: { propertyField: "imageUrls", imageIndex: 1, optional: true },
  image3: { propertyField: "imageUrls", imageIndex: 2, optional: true },

  // Broker 1 fields
  brokerName1: { brokerField: "name", brokerIndex: 0 },
  brokerEmail1: { brokerField: "email", brokerIndex: 0 },
  brokerPhone1: { brokerField: "phone", brokerIndex: 0 },
  brokerImage1: { brokerField: "imageUrl", brokerIndex: 0 },
  brokerLicense1: { brokerField: "licenseNumber", brokerIndex: 0 },

  // Broker 2 fields
  brokerName2: { brokerField: "name", brokerIndex: 1 },
  brokerEmail2: { brokerField: "email", brokerIndex: 1 },
  brokerPhone2: { brokerField: "phone", brokerIndex: 1 },
  brokerImage2: { brokerField: "imageUrl", brokerIndex: 1 },
  brokerLicense2: { brokerField: "licenseNumber", brokerIndex: 1 },
};

type ValidationContext = {
  property: Property;
  requiredAgentCount: number;
};

export type FieldMappingValidationResult = {
  isValid: boolean;
  errors: FieldMappingError[];
  mappings: FieldMapping[];
};

const createMapping = (
  fieldName: string,
  fieldType: FieldType,
  config: FieldMappingConfig,
): FieldMapping => {
  return {
    canvaField: fieldName,
    propertyField: config.propertyField,
    brokerField: config.brokerField,
    brokerIndex: config.brokerIndex,
    imageIndex: config.imageIndex,
    fieldType,
  };
};

const getFieldMappingError = (
  fieldName: string,
  dataset: string[],
  config: FieldMappingConfig,
  context: ValidationContext,
): FieldMappingError | null => {
  if (dataset.includes(fieldName)) {
    return null;
  }

  // if the field is optional, we can skip it without error
  if (config.optional) {
    return null;
  }

  // all non-optional fields that are not broker fields are required
  if (!config.brokerField) {
    return {
      field: fieldName,
      reason: `Field "${fieldName}" is missing from in the brand template`,
      type: "missing_field",
    };
  }

  // broker fields

  // missing broker field for the first agent found, and we need at least one agent
  if (config.brokerIndex === 0 && context.requiredAgentCount > 0) {
    return {
      field: fieldName,
      reason: "This field requires the first agent to be selected",
      type: "missing_broker",
    };
  }

  if (config.brokerIndex === 1 && context.requiredAgentCount > 1) {
    return {
      field: fieldName,
      reason: "This field requires the second agent to be selected",
      type: "missing_broker2",
    };
  }

  // if we get here, the field is a broker field and we've checked for the required agent count
  return null;
};

export const validateFieldMappings = async (
  template: BrandTemplate,
  context: ValidationContext,
): Promise<FieldMappingValidationResult> => {
  const errors: FieldMappingError[] = [];
  const mappings: FieldMapping[] = [];

  try {
    const response = await getBrandTemplateDataset(template.id);

    if (!response.dataset) {
      return {
        isValid: false,
        errors: [
          {
            field: "Template Dataset",
            reason: `No dataset found in template. Expected fields: ${Object.keys(FIELD_MAPPING_CONFIG).join(", ")}.`,
            type: "no_dataset",
          },
        ],
        mappings: [],
      };
    }

    const datasetFields = Object.keys(response.dataset);

    // Check for missing fields from the configuration
    Object.keys(FIELD_MAPPING_CONFIG).forEach((fieldName) => {
      const config = FIELD_MAPPING_CONFIG[fieldName];
      const error = getFieldMappingError(
        fieldName,
        datasetFields,
        config,
        context,
      );

      if (error) {
        errors.push(error);
        return;
      }

      const fieldData = response.dataset?.[fieldName];
      if (fieldData?.type) {
        mappings.push(createMapping(fieldName, fieldData.type, config));
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      mappings,
    };
  } catch (err) {
    return {
      isValid: false,
      errors: [
        {
          field: "Template Validation",
          reason:
            err instanceof Error
              ? err.message
              : "Failed to fetch template fields. Please ensure the template has a valid dataset with supported field types (text, image, chart).",
          type: "no_dataset",
        },
      ],
      mappings: [],
    };
  }
};
