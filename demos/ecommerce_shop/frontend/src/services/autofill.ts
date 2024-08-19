import type {
  Asset,
  Dataset,
  GetBrandTemplateDatasetResponse,
  GetDesignAutofillJobResponse,
} from "@canva/connect-api-ts/types.gen";
import type { Product, ProductAutofillDataset } from "src/models";
import {
  getAutofillJobStatus,
  getBrandTemplateDataset,
  postAutofill,
} from "src/services";
import { poll } from "../../../../common/utils/poll";
import { uploadAsset } from "./asset";

/**
 * Auto-fills a brand template with product data.
 * @param {Object} options - The options object.
 * @param {string} options.brandTemplateId - The ID of the brand template to autofill.
 * @param {Product} options.product - The product data to autofill.
 * @param {string} options.discount - The discount to autofill.
 * @returns {Promise<GetAutofillJobResponse>} A promise that resolves with the autofill job response.
 */
export const autoFillTemplateWithProduct = async ({
  brandTemplateId,
  product,
  discount,
}: {
  brandTemplateId: string;
  product: Product;
  discount: string;
}): Promise<GetDesignAutofillJobResponse> => {
  try {
    const { dataset } = await getBrandTemplateDataset(brandTemplateId);

    if (!dataset) {
      throw new Error("Dataset for brand template is undefined.");
    }

    if (!isDataSetCompatible(dataset)) {
      throw new Error(
        "Selected brand template cannot be use to create a promo due to missing data fields.",
      );
    }

    const asset = await uploadAsset({
      name: product.name,
      imageUrl: product.imageUrl,
    });

    const autofillData = constructPromoAutofillData(product, discount, asset);

    const autofillJobResponse = await postAutofill(
      brandTemplateId,
      autofillData,
    );

    return poll(() => getAutofillJobStatus(autofillJobResponse.job.id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const requiredPromoAutofillData = ["name", "image", "price"];
const isDataSetCompatible = (
  dataSet: Required<GetBrandTemplateDatasetResponse>["dataset"],
) => {
  return requiredPromoAutofillData.every((key) => key in dataSet);
};

/**
 * Constructs autofill data from product, discount and asset metadata.
 * @param {Product} product - The product data.
 * @param {string} discount - The discount.
 * @param {Asset} asset - The asset.
 * @returns {ProductAutofillDataset} The constructed autofill data for a product.
 */
const constructPromoAutofillData = (
  product: Product,
  discount: string,
  asset: Asset,
): ProductAutofillDataset => {
  return {
    name: {
      type: "text",
      text: product.name,
    },
    image: {
      type: "image",
      asset_id: asset.id,
    },
    price: {
      type: "text",
      text: `$${product.price.toFixed(2)}`,
    },
    discount: {
      type: "text",
      text: `Save ${discount}`,
    },
  } satisfies Dataset;
};
