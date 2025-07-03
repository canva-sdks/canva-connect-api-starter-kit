import type { GetDesignExportJobResponse } from "@canva/connect-api-ts/types.gen";
import { createDesignExportJob, getDesignExportJobStatus } from "src/services";
import { poll } from "../../../../common/utils/poll";
import type { ExportFormat } from "@canva/connect-api-ts/types.gen";

/**
 * Create an export and await the result of the export job.
 * @param {Object} options - The options object.
 * @param {string} options.designId - The ID of the design to export.
 * @param {'PDF' | 'JPG'} options.fileType - The desired export file type.
 * @param {number[]} [options.pageList] - The pages of the design to export, by default the first page is exported.
 * @returns {Promise<GetDesignExportJobResponse>} A promise that resolves with the export job response.
 */
export const exportDesign = async ({
  designId,
  fileType,
  pageList,
}: {
  designId: string;
  fileType: "PDF" | "JPG";
  pageList?: number[];
}): Promise<GetDesignExportJobResponse> => {
  try {
    let exportFormat: ExportFormat;
    if (fileType === "PDF") {
      exportFormat = {
        type: "pdf",
        pages: pageList,
      };
    } else if (fileType === "JPG") {
      exportFormat = {
        type: "jpg",
        pages: pageList,
        quality: 90,
      };
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    const exportJobResponse = await createDesignExportJob({
      designId,
      exportFormat,
    });
    return poll(() => getDesignExportJobStatus(exportJobResponse.job.id));
  } catch (error) {
    console.error("Error during design export:", error);
    throw error;
  }
};
