import type { Design } from "@canva/connect-api-ts/types.gen";
import type { Product } from "src/models";
import type { Assets } from "./asset";

import type { Client } from "@hey-api/client-fetch";
import { DesignService } from "@canva/connect-api-ts";
import { upsertProductDesign } from "./api";

const MAX_NAME_LENGTH = 50;

export class Designs {
  constructor(
    private client: Client,
    private assets: Assets,
  ) {}

  async uploadAssetAndCreateDesignFromProduct({
    product,
    campaignName,
  }: {
    product: Product;
    campaignName?: string;
  }): Promise<{
    design: Design;
    refreshedProducts?: Product[];
  }> {
    const name = campaignName || product.name.slice(0, MAX_NAME_LENGTH);

    const asset = await this.assets.uploadAsset({
      name,
      imageUrl: product.imageUrl,
    });

    const result = await DesignService.createDesign({
      client: this.client,
      body: {
        asset_id: asset.id,
        title: name,
      },
    });

    if (result.error) {
      console.error(result.error);
      throw new Error(result.error.message);
    }

    const createDesignResult = result.data;

    if (!createDesignResult) {
      throw new Error("Unable to create design");
    }

    if (campaignName) {
      return { design: createDesignResult.design };
    }

    const createProductDesignResult = await upsertProductDesign({
      productId: product.id,
      productDesign: {
        designId: createDesignResult.design.id,
        designEditUrl: createDesignResult.design.urls.edit_url,
      },
    });
    return {
      design: createDesignResult.design,
      refreshedProducts: createProductDesignResult.products,
    };
  }

  async getDesign(designId: string): Promise<{
    design: Design;
  }> {
    const design = await DesignService.getDesign({
      client: this.client,
      path: { designId },
    });

    if (!design || design.error) throw new Error("Unable to find design");

    return { design: design.data.design };
  }
}
