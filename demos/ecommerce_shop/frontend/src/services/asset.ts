import type { Asset } from "@canva/connect-api-ts/types.gen";
import { createAssetUpload, getAssetUploadJob } from "./api";
import { poll } from "../../../../common/utils/poll";

/**
 * Fetches image blob from the provided image source.
 * @param {string} imageSrc - The URL of the image.
 * @returns {Promise<Blob>} A promise that resolves with the fetched image blob.
 */
const getImageBlob = async (imageSrc: string): Promise<Blob> => {
  const response = await fetch(imageSrc);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from "${imageSrc}". Status: ${response.status}`,
    );
  }
  const blob = await response.blob();
  return blob;
};

/**
 * Uploads an asset and polls it until it's completed.
 *
 * @returns {Promise<Asset>} A promise that resolves with the uploaded asset.
 */
export const uploadAsset = async ({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string;
}): Promise<Asset> => {
  const imageBlob = await getImageBlob(imageUrl);
  const result = await createAssetUpload({
    image: imageBlob,
    name,
  });

  if (!result) {
    throw new Error(`Upload product asset failed for "${name}".`);
  }

  const asset = await pollAssetUpload(result.job.id);

  if (!asset) {
    throw new Error(
      `Asset upload for "${name}" with job id "${result.job.id}" was unsuccessful`,
    );
  }

  return asset;
};

/**
 * Polls an asset upload job until it's completed
 *
 * @param {string} jobId - The id of the asset upload job.
 * @returns {Promise<CreateAssetUploadJobResponse>} A promise that resolves with the created asset.
 */
const pollAssetUpload = async (jobId: string): Promise<Asset> => {
  const response = await poll(() => getAssetUploadJob(jobId));

  if (!response.job.asset) {
    throw new Error(
      `Asset upload for job id "${response.job.id}" was unsuccessful`,
    );
  }

  return response.job.asset;
};
