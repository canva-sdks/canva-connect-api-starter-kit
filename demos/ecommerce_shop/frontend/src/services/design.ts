import type {
  CreateDesignResponse,
  Design,
} from "@canva/connect-api-ts/types.gen";
import type { Product } from "src/models";
import { getDesign, createDesign, upsertProductDesign } from "src/services";
import { uploadAsset } from "./asset";

const MAX_NAME_LENGTH = 50;

export const uploadAssetAndCreateDesignFromProduct = async ({
  product,
  campaignName,
}: {
  product: Product;
  campaignName?: string;
}): Promise<{
  design: Design;
  refreshedProducts?: Product[];
}> => {
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

  // If the request has a campaignName it is assumed to come from a marketing
  // page and so an upsertProductDesign is not required.
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
};

export const fetchDesign = async ({
  designId,
}: {
  designId: string;
}): Promise<{
  design: Design;
}> => {
  const design = await getDesign(designId);

  if (!design) throw new Error("Unable to find design");

  return { design: design.design };
};
