import type {
  DownloadExportedDesignRequest,
  DownloadExportedDesignResponse,
  GetProductsResponse,
  UpsertProductDesignRequest,
  UpsertProductDesignResponse,
} from "../models";

const endpoints = {
  PRODUCTS: "/products",
  UPSERT_PRODUCT_DESIGN: "/products/:productId/design",
  DOWNLOAD_EXPORT: "/exports/download",
};

export const getProducts = async (): Promise<GetProductsResponse> => {
  return fetchData(endpoints.PRODUCTS);
};

export async function fetchData<T>(endpoint: string): Promise<T> {
  const url = new URL(endpoint, process.env.BACKEND_URL);
  const response = await fetch(url, { credentials: "include" });

  if (response.ok) {
    return (await response.json()) as T;
  }

  return Promise.reject(`Error ${response.status}: ${response.statusText}`);
}

export const upsertProductDesign = async ({
  productId,
  productDesign,
}: UpsertProductDesignRequest): Promise<UpsertProductDesignResponse> => {
  return postPutData(
    endpoints.UPSERT_PRODUCT_DESIGN.replace(":productId", productId.toString()),
    productDesign,
    "PUT",
  );
};

export const downloadExportedImage = async ({
  exportedDesignUrl,
  productId,
}: DownloadExportedDesignRequest): Promise<DownloadExportedDesignResponse> => {
  return postPutData(endpoints.DOWNLOAD_EXPORT, {
    exportedDesignUrl,
    productId,
  });
};

const postPutData = async (
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: Record<string, any>,
  method: "POST" | "PUT" = "POST",
) => {
  const url = new URL(endpoint, process.env.BACKEND_URL);

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
