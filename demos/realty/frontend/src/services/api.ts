import { BACKEND_HOST } from "src/config";
import type {
  CreateAssetUploadJobResponse,
  CreateDesignAutofillJobRequest,
  CreateDesignExportJobRequest,
  CreateDesignExportJobResponse,
  CreateDesignRequest,
  CreateDesignResponse,
  ExportFormat,
  GetAssetUploadJobResponse,
  GetBrandTemplateDatasetResponse,
  GetDesignAutofillJobResponse,
  GetDesignExportJobResponse,
  GetDesignResponse,
  ListBrandTemplatesResponse,
  UserProfileResponse,
} from "@canva/connect-api-ts/types.gen";
import type {
  GetBrokersResponse,
  PropertyAutofillDataset,
  DownloadExportedDesignRequest,
  DownloadExportedDesignResponse,
} from "@realty-demo/shared-models";

const endpoints = {
  AUTHORIZE: "/authorize",
  REVOKE: "/revoke",
  CREATE_ASSET_UPLOAD_JOB: "/asset-uploads",
  GET_ASSET_UPLOAD_JOB: "/asset-uploads/:jobId",
  CREATE_AUTOFILL_JOB: "/autofill/create/:id",
  GET_AUTOFILL_JOB_BY_ID: "/autofill/get/:jobId",
  BRAND_TEMPLATES: "/api/brand-templates",
  DESIGNS: "/designs",
  GET_DESIGN: "/design/:designId",
  BROKERS: "/brokers",
  USER: "/user",
  CREATE_DESIGN_EXPORT_JOB: "/exports",
  GET_DESIGN_EXPORT_JOB: "/exports/:jobId",
  DOWNLOAD_EXPORT: "/exports/download",
};

export const getUser = async (): Promise<UserProfileResponse> => {
  return fetchData(endpoints.USER);
};

export const getDesign = async (id: string): Promise<GetDesignResponse> => {
  return fetchData(endpoints.GET_DESIGN.replace(":designId", id));
};

export const getBrokers = async (): Promise<GetBrokersResponse> => {
  return fetchData(endpoints.BROKERS);
};

export const getAssetUploadJob = async (
  id: string,
): Promise<GetAssetUploadJobResponse> => {
  return fetchData(endpoints.GET_ASSET_UPLOAD_JOB.replace(":jobId", id));
};

export const getBrandTemplates =
  async (): Promise<ListBrandTemplatesResponse> => {
    return fetchData(endpoints.BRAND_TEMPLATES);
  };

export const getBrandTemplateDataset = async (
  id: string,
): Promise<GetBrandTemplateDatasetResponse> => {
  return fetchData(`${endpoints.BRAND_TEMPLATES}/${id}/dataset`);
};

export const getAutofillJobStatus = async (
  jobId: string,
): Promise<GetDesignAutofillJobResponse> => {
  return fetchData(endpoints.GET_AUTOFILL_JOB_BY_ID.replace(":jobId", jobId));
};

export const getDesignExportJobStatus = async (
  jobId: string,
): Promise<GetDesignExportJobResponse> => {
  return fetchData(endpoints.GET_DESIGN_EXPORT_JOB.replace(":jobId", jobId));
};

export async function fetchData<T>(endpoint: string): Promise<T> {
  const url = new URL(endpoint, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });

  if (response.ok) {
    return (await response.json()) as T;
  }

  return Promise.reject(`Error ${response.status}: ${response.statusText}`);
}

export const postAutofill = async (
  id: string,
  data: PropertyAutofillDataset,
): Promise<GetDesignAutofillJobResponse> => {
  const body: CreateDesignAutofillJobRequest = {
    brand_template_id: id,
    data,
  };

  const endpointPath = endpoints.CREATE_AUTOFILL_JOB.replace(":id", id);

  return postData(endpointPath, body);
};

export const createDesign = async ({
  assetId,
  title,
}: {
  assetId: string;
  title: string;
}): Promise<CreateDesignResponse> => {
  const body: CreateDesignRequest = {
    design_type: undefined,
    asset_id: assetId,
    title,
  };

  return postData(endpoints.DESIGNS, body);
};

export const createAssetUpload = async ({
  image,
  name,
}: {
  image: Blob;
  name: string;
}): Promise<CreateAssetUploadJobResponse | undefined> => {
  const url = new URL("/asset-uploads", BACKEND_HOST);

  const formData = new FormData();
  formData.append("image", image, "image.jpg");
  formData.append("name", name);

  console.log("Uploading asset:", {
    name,
    imageType: image.type,
    imageSize: image.size,
  });

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Asset upload failed:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    return Promise.reject(`Error ${response.status}: ${errorText}`);
  }

  return response.json();
};

export const downloadExportedImage = async ({
  exportedDesignUrls,
  flyerId,
}: DownloadExportedDesignRequest): Promise<DownloadExportedDesignResponse> => {
  return postData(endpoints.DOWNLOAD_EXPORT, {
    exportedDesignUrls,
    flyerId,
  });
};

export const createDesignExportJob = async ({
  designId,
  exportFormat,
}: {
  designId: string;
  exportFormat: ExportFormat;
}): Promise<CreateDesignExportJobResponse> => {
  const body: CreateDesignExportJobRequest = {
    design_id: designId,
    format: exportFormat,
  };

  return postData(endpoints.CREATE_DESIGN_EXPORT_JOB, body);
};

export const postData = async (
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: Record<string, any>,
  method: "POST" | "PUT" = "POST",
) => {
  const url = new URL(endpoint, BACKEND_HOST);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();
    return responseBody;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
