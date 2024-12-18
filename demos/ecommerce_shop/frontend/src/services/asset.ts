import type {
  Asset,
  GetAssetUploadJobResponse,
} from "@canva/connect-api-ts/types.gen";
import { poll } from "../../../../common/utils/poll";
import type { Client } from "@hey-api/client-fetch";
import { AssetService } from "@canva/connect-api-ts";
import { createClient } from "@hey-api/client-fetch";

export class Assets {
  constructor(private client: Client) {}

  /**
   * Fetches image blob from the provided image source.
   * @param {string} imageSrc - The URL of the image.
   * @returns {Promise<Blob>} A promise that resolves with the fetched image blob.
   */
  async getImageBlob(imageSrc: string): Promise<Blob> {
    const response = await fetch(imageSrc);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image from "${imageSrc}". Status: ${response.status}`,
      );
    }
    const blob = await response.blob();
    return blob;
  }

  /**
   * Uploads an asset and polls it until it's completed.
   *
   * @returns {Promise<Asset>} A promise that resolves with the uploaded asset.
   */
  async uploadAsset({
    name,
    imageUrl,
  }: {
    name: string;
    imageUrl: string;
  }): Promise<Asset> {
    const imageBlob = await this.getImageBlob(imageUrl);
    const result = await this.createAssetUpload({
      image: imageBlob,
      name,
    });

    if (!result) {
      throw new Error(`Upload product asset failed for "${name}".`);
    }

    const asset = await this.pollAssetUpload(result.job.id);

    if (!asset) {
      throw new Error(
        `Asset upload for "${name}" with job id "${result.job.id}" was unsuccessful`,
      );
    }

    return asset;
  }

  /**
   * Polls an asset upload job until it's completed
   *
   * @param {string} jobId - The id of the asset upload job.
   * @returns {Promise<CreateAssetUploadJobResponse>} A promise that resolves with the created asset.
   */
  async pollAssetUpload(jobId: string): Promise<Asset> {
    const response = await poll(() => this.getAssetUploadJob(jobId));

    if (!response.job.asset) {
      throw new Error(
        `Asset upload for job id "${response.job.id}" was unsuccessful`,
      );
    }

    return response.job.asset;
  }

  /**
   * Fetches an asset upload job by id.
   *
   * @param {string} assetId - The id of the asset.
   * @returns {Promise<Asset>} A promise that resolves with the fetched asset.
   */
  private async getAssetUploadJob(
    jobId: string,
  ): Promise<GetAssetUploadJobResponse> {
    const result = await AssetService.getAssetUploadJob({
      client: this.client,
      path: { jobId },
    });

    if (result.error) {
      console.error(result.error);
      throw new Error(result.error.message);
    }

    return result.data;
  }

  private async createAssetUpload({
    image,
    name,
  }: {
    image: Blob;
    name: string;
  }): Promise<GetAssetUploadJobResponse> {
    const clientConfig = this.client.getConfig();
    const baseHeaders = clientConfig.headers as Headers;
    const authorizationHeader = baseHeaders.get("authorization");
    if (!authorizationHeader) {
      throw new Error("No authorization header found.");
    }

    const client = createClient({
      ...clientConfig,
      headers: new Headers({
        Authorization: authorizationHeader,
        "Content-Type": "application/octet-stream",
      }),
    });

    const result = await AssetService.createAssetUploadJob({
      client,
      headers: {
        "Asset-Upload-Metadata": {
          name_base64: btoa(name),
        },
      },
      body: image,
      bodySerializer: (body: Blob) => body,
    });

    if (result.error) {
      console.error(result.error);
      throw new Error(result.error.message);
    }

    return result.data;
  }
}
