import { BACKEND_HOST } from "src/config";
import type {
  CreateAssetUploadJobResponse,
  CreateDesignAutofillJobRequest,
  CreateDesignRequest,
  GetAssetUploadJobResponse,
  GetBrandTemplateDatasetResponse,
  GetDesignAutofillJobResponse,
  ListBrandTemplatesResponse,
  UserProfileResponse,
} from "@canva/connect-api-ts/types.gen";
import type { GetProductsResponse, ProductAutofillDataset } from "../models";

const endpoints = {
  AUTHORIZE: "/authorize",
  REVOKE: "/revoke",
  CREATE_ASSET_UPLOAD_JOB: "/asset-uploads",
  GET_ASSET_UPLOAD_JOB: "/asset-uploads/:jobId",
  CREATE_AUTOFILL_JOB: "/autofill/create",
  GET_AUTOFILL_JOB_BY_ID: "/autofill/get/:jobId",
  BRAND_TEMPLATES: "/brand-templates",
  DESIGNS: "/designs",
  PRODUCTS: "/products",
  USER: "/user",
};

export const getUser = async (): Promise<UserProfileResponse> => {
  return fetchData(endpoints.USER);
};

export const getProducts = async (): Promise<GetProductsResponse> => {
  return fetchData(endpoints.PRODUCTS);
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
  data: ProductAutofillDataset,
): Promise<GetDesignAutofillJobResponse> => {
  const body: CreateDesignAutofillJobRequest = {
    brand_template_id: id,
    data,
  };

  return postData(endpoints.CREATE_AUTOFILL_JOB, body);
};

export const createDesign = async ({
  assetId,
  title,
}: {
  assetId: string;
  title: string;
}) => {
  const body: CreateDesignRequest = {
    design_type: undefined,
    asset_id: assetId,
    title,
  };

  return postData(endpoints.DESIGNS, body);
};

export const createAssetUpload = async ({
  name,
  image,
}: {
  name: string;
  image: Blob;
}): Promise<CreateAssetUploadJobResponse | undefined> => {
  const url = new URL(endpoints.CREATE_ASSET_UPLOAD_JOB, BACKEND_HOST);

  const formData = new FormData();
  formData.append("image", image);
  formData.append("name", name);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject(`Error ${response.status}: ${response.statusText}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postData = async (endpoint: string, body: Record<string, any>) => {
  const url = new URL(endpoint, BACKEND_HOST);

  try {
    const response = await fetch(url, {
      method: "POST",
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
