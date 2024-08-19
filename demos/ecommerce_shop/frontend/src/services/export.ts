import type { GetDesignExportJobResponse } from "@canva/connect-api-ts/types.gen";
import { createDesignExportJob, getDesignExportJobStatus } from "src/services";
import { poll } from "../../../../common/utils/poll";

/**
 * Create an export and await the result of the export job.
 * @param {Object} options - The options object.
 * @param {string} options.designId - The ID of the design to export.
 * @param {string} options.pageList - The pages of the design to export, by default the first page is exported.
 * @returns {Promise<GetAutofillJobResponse>} A promise that resolves with the autofill job response.
 */
export const exportDesign = async ({
  designId,
  pageList = [1],
}: {
  designId: string;
  pageList?: number[];
}): Promise<GetDesignExportJobResponse> => {
  try {
    const exportJobResponse = await createDesignExportJob({
      designId,
      exportFormat: {
        type: "png",
        pages: pageList,
        lossless: true,
        width: 1000,
        height: 1000,
      },
    });
    return poll(() => getDesignExportJobStatus(exportJobResponse.job.id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
