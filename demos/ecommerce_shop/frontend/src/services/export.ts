import type { GetDesignExportJobResponse } from "@canva/connect-api-ts/types.gen";
import { poll } from "../../../../common/utils/poll";
import { ExportService } from "@canva/connect-api-ts";
import type { Client } from "@hey-api/client-fetch";

export class Exports {
  constructor(private client: Client) {}

  /**
   * Create an export and await the result of the export job.
   * @param {Object} options - The options object.
   * @param {string} options.designId - The ID of the design to export.
   * @param {string} options.pageList - The pages of the design to export, by default the first page is exported.
   * @returns {Promise<GetAutofillJobResponse>} A promise that resolves with the autofill job response.
   */
  async exportDesign({
    designId,
    pageList = [1],
  }: {
    designId: string;
    pageList?: number[];
  }): Promise<GetDesignExportJobResponse> {
    try {
      const exportJobResponse = await ExportService.createDesignExportJob({
        client: this.client,
        body: {
          design_id: designId,
          format: {
            type: "png",
            pages: pageList,
            lossless: true,
            width: 1000,
            height: 1000,
          },
        },
      });

      if (exportJobResponse.error) {
        console.error(exportJobResponse.error);
        throw new Error(exportJobResponse.error.message);
      }

      return poll(() =>
        this.getDesignExportJobStatus(exportJobResponse.data.job.id),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDesignExportJobStatus(
    exportId: string,
  ): Promise<GetDesignExportJobResponse> {
    const result = await ExportService.getDesignExportJob({
      client: this.client,
      path: {
        exportId,
      },
    });

    if (result.error) {
      console.error(result.error);
      throw new Error(result.error.message);
    }

    return result.data;
  }
}
