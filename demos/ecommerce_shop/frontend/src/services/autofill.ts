import type {
  Asset,
  BrandTemplate,
  CreateDesignAutofillJobRequest,
  Dataset,
  GetBrandTemplateDatasetResponse,
  GetDesignAutofillJobResponse,
} from "@canva/connect-api-ts/types.gen";
import type { Product, ProductAutofillDataset } from "src/models";
import { poll } from "../../../../common/utils/poll";
import type { Client } from "@hey-api/client-fetch";
import { AutofillService, BrandTemplateService } from "@canva/connect-api-ts";
import type { Assets } from "./asset";

export class Autofill {
  private static requiredPromoAutofillData = ["name", "image", "price"];

  constructor(
    private client: Client,
    private assets: Assets,
  ) {}

  async listBrandTemplates(): Promise<BrandTemplate[]> {
    const result = await BrandTemplateService.listBrandTemplates({
      client: this.client,
    });

    if (result.error) {
      console.error(result.error);
      throw new Error(result.error.message);
    }

    let items = result.data.items;
    let continuation = result.data.continuation;

    while (continuation) {
      const nextResult = await BrandTemplateService.listBrandTemplates({
        client: this.client,
        query: {
          continuation,
        },
      });

      if (nextResult.error) {
        console.error(nextResult.error);
        throw new Error(nextResult.error.message);
      }

      items = items.concat(nextResult.data.items);
      continuation = nextResult.data.continuation;
    }

    return items;
  }

  /**
   * Auto-fills a brand template with product data.
   * @param {Object} options - The options object.
   * @param {string} options.brandTemplateId - The ID of the brand template to autofill.
   * @param {Product} options.product - The product data to autofill.
   * @param {string} options.discount - The discount to autofill.
   * @returns {Promise<GetAutofillJobResponse>} A promise that resolves with the autofill job response.
   */
  async autoFillTemplateWithProduct({
    brandTemplateId,
    product,
    discount,
  }: {
    brandTemplateId: string;
    product: Product;
    discount: string;
  }): Promise<GetDesignAutofillJobResponse> {
    try {
      const response = await BrandTemplateService.getBrandTemplateDataset({
        client: this.client,
        path: {
          brandTemplateId,
        },
      });
      if (response.error) {
        console.log(response.error);
        throw new Error(response.error.message);
      }
      if (!response.data || !response.data.dataset) {
        throw new Error("Dataset for brand template is undefined.");
      }
      const dataset = response.data.dataset;

      if (!Autofill.isDataSetCompatible(dataset)) {
        throw new Error(
          "Selected brand template cannot be used to create a promo due to missing data fields.",
        );
      }

      const asset = await this.assets.uploadAsset({
        name: product.name,
        imageUrl: product.imageUrl,
      });

      const autofillData = Autofill.constructPromoAutofillData(
        product,
        discount,
        asset,
      );

      const autofillJobResponse = await this.postAutofill(
        brandTemplateId,
        autofillData,
      );

      return poll(() => this.getAutofillJobStatus(autofillJobResponse.job.id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private static isDataSetCompatible(
    dataSet: Required<GetBrandTemplateDatasetResponse>["dataset"],
  ): boolean {
    return Autofill.requiredPromoAutofillData.every((key) => key in dataSet);
  }

  /**
   * Constructs autofill data from product, discount and asset metadata.
   * @param {Product} product - The product data.
   * @param {string} discount - The discount.
   * @param {Asset} asset - The asset.
   * @returns {ProductAutofillDataset} The constructed autofill data for a product.
   */
  private static constructPromoAutofillData(
    product: Product,
    discount: string,
    asset: Asset,
  ): ProductAutofillDataset {
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
  }

  private async getAutofillJobStatus(
    jobId: string,
  ): Promise<GetDesignAutofillJobResponse> {
    const result = await AutofillService.getDesignAutofillJob({
      client: this.client,
      path: {
        jobId,
      },
    });

    if (result.error) {
      console.log(result.error);
      throw new Error(result.error.message);
    }

    return result.data;
  }

  private async postAutofill(
    brandTemplateId: string,
    autofillData: ProductAutofillDataset,
  ): Promise<GetDesignAutofillJobResponse> {
    const body: CreateDesignAutofillJobRequest = {
      data: autofillData,
      brand_template_id: brandTemplateId,
    };
    const result = await AutofillService.createDesignAutofillJob({
      client: this.client,
      path: {
        brandTemplateId,
      },
      body,
    });

    if (result.error) {
      console.log(result.error);
      throw new Error(result.error.message);
    }

    return result.data;
  }
}
