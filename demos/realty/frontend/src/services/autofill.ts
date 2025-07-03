import type {
  GetDesignAutofillJobResponse,
  Asset,
} from "@canva/connect-api-ts/types.gen";
import type {
  Property,
  PropertyAutofillDataset,
  Broker,
} from "@realty-demo/shared-models";
import { getAutofillJobStatus, postAutofill } from "src/services";
import { poll } from "../../../../common/utils/poll";
import { uploadAsset } from "./asset";
import type { FieldMapping } from "./field-mapping-validation";

type AutofillParams = {
  brandTemplateId: string;
  property: Property;
  brokers: Broker[];
  fieldMappings: FieldMapping[];
};

type ImageUploadResult = {
  mapping: FieldMapping;
  asset: Asset;
};

/**
 * Uploads images for all image field mappings
 */
const uploadMappedImages = async (
  imageFieldMappings: FieldMapping[],
  property: Property,
  brokers: Broker[],
): Promise<ImageUploadResult[]> => {
  const imageUploads = await Promise.all(
    imageFieldMappings.map(
      async (mapping): Promise<ImageUploadResult | null> => {
        const imageUrl = getImageUrl(mapping, property, brokers);

        if (!imageUrl) {
          return null;
        }

        const asset = await uploadAsset({
          name: `${property.address}-${mapping.canvaField}`,
          imageUrl,
        });

        return { mapping, asset };
      },
    ),
  );

  return imageUploads.filter(
    (upload): upload is ImageUploadResult => upload != null,
  );
};

/**
 * Gets the image URL for a field mapping
 */
const getImageUrl = (
  mapping: FieldMapping,
  property: Property,
  brokers: Broker[],
): string | undefined => {
  if (mapping.propertyField) {
    if (
      mapping.propertyField === "imageUrls" &&
      mapping.imageIndex !== undefined
    ) {
      return property.imageUrls[mapping.imageIndex];
    }

    const value = property[mapping.propertyField];
    return Array.isArray(value) ? value[0] : (value as string);
  }

  if (mapping.brokerField) {
    const targetBroker = brokers[mapping.brokerIndex || 0];

    if (targetBroker?.[mapping.brokerField]) {
      return targetBroker[mapping.brokerField].toString();
    }

    throw new Error(
      `Broker field "${mapping.brokerField}" not found for broker ${(mapping.brokerIndex ?? 0) + 1}`,
    );
  }

  return undefined;
};

/**
 * Gets the text value for a field mapping
 */
const getTextValue = (
  mapping: FieldMapping,
  property: Property,
  brokers: Broker[],
): string | undefined => {
  // Special handling for addressLine2
  if (mapping.canvaField === "addressLine2") {
    return `${property.city}, ${property.state} ${property.zipCode}`;
  }

  // Special case for cars field
  if (mapping.canvaField === "cars") {
    return "2";
  }

  if (mapping.propertyField) {
    const value = property[mapping.propertyField];

    // Handle array values
    if (Array.isArray(value)) {
      return value[0]?.toString();
    }

    // Skip object values
    if (typeof value === "object") {
      return undefined;
    }

    // Format price
    if (mapping.propertyField === "price" && typeof value === "number") {
      return formatCurrency(value);
    }

    return value?.toString();
  }

  if (mapping.brokerField) {
    const targetBroker = brokers[mapping.brokerIndex || 0];
    return targetBroker?.[mapping.brokerField]?.toString();
  }

  return undefined;
};

/**
 * Creates autofill data from field mappings
 */
const createAutofillData = (
  fieldMappings: FieldMapping[],
  property: Property,
  brokers: Broker[],
  imageUploads: ImageUploadResult[],
): PropertyAutofillDataset => {
  return fieldMappings.reduce((acc, mapping) => {
    if (mapping.fieldType === "image") {
      const imageUpload = imageUploads.find(
        (upload) => upload.mapping.canvaField === mapping.canvaField,
      );

      if (imageUpload) {
        acc[mapping.canvaField] = {
          type: "image",
          asset_id: imageUpload.asset.id,
        };
      }
    } else if (mapping.fieldType === "text") {
      const text = getTextValue(mapping, property, brokers);

      if (text !== undefined) {
        acc[mapping.canvaField] = {
          type: "text",
          text,
        };
      }
    }
    // Add support for chart type if needed

    return acc;
  }, {} as PropertyAutofillDataset);
};

/**
 * Formats a number as currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Auto-fills a brand template with property and broker data using field mappings.
 *
 * This function uses pre-validated field mappings to populate a Canva brand template.
 * Use `validateFieldMappings` from field-mapping-validation.ts to generate the mappings.
 */
export const autoFillTemplate = async ({
  brandTemplateId,
  property,
  brokers,
  fieldMappings,
}: AutofillParams): Promise<GetDesignAutofillJobResponse> => {
  try {
    // Handle image uploads
    const imageFieldMappings = fieldMappings.filter(
      (mapping) => mapping.fieldType === "image",
    );

    const imageUploads = await uploadMappedImages(
      imageFieldMappings,
      property,
      brokers,
    );

    // Create autofill data
    const autofillData = createAutofillData(
      fieldMappings,
      property,
      brokers,
      imageUploads,
    );

    // Submit autofill job
    const autofillJobResponse = await postAutofill(
      brandTemplateId,
      autofillData,
    );

    // Poll for completion
    return poll(() => getAutofillJobStatus(autofillJobResponse.job.id));
  } catch (error) {
    console.error("Autofill error:", error);
    throw error;
  }
};
