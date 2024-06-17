import type {
  CreateDesignResponse,
  Design,
} from "@canva/connect-api-ts/types.gen";
import type { Product } from "src/models";
import { createDesign } from "src/services";
import { uploadAsset } from "./asset";

const MAX_NAME_LENGTH = 50;

export const uploadAssetAndCreateDesignFromProduct = async ({
  product,
  campaignName,
}: {
  product: Product;
  campaignName?: string;
}): Promise<Design> => {
  const name = campaignName || product.name.slice(0, MAX_NAME_LENGTH);

  const asset = await uploadAsset({
    name,
    imageUrl: product.imageUrl,
  });

  const createDesignResult: CreateDesignResponse = await createDesign({
    assetId: asset.id,
    title: name,
  });

  if (!createDesignResult) {
    throw new Error("Unable to create design");
  }

  return createDesignResult.design;
};
