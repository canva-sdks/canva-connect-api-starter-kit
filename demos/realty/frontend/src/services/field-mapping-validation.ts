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
  type: "unknown_field" | "invalid_field_type" | "no_dataset";
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

    // Only validate fields that exist in the template's dataset
    datasetFields.forEach((fieldName) => {
      const config = FIELD_MAPPING_CONFIG[fieldName];

      if (!config) {
        // Field exists in template but not in our configuration
        errors.push({
          field: fieldName,
          reason: `Field "${fieldName}" exists in template but is not supported by the application`,
          type: "unknown_field",
        });
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
