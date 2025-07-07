import type {
  GetPropertiesResponse,
  GetPropertyResponse,
} from "@realty-demo/shared-models";
import { fetchData } from "./api";

const endpoints = {
  PROPERTIES: "/properties",
  PROPERTY_BY_ID: "/properties/:propertyId",
  UPSERT_PROPERTY_DESIGN: "/properties/:propertyId/design",
};

export const getProperties = async (): Promise<GetPropertiesResponse> => {
  return fetchData(endpoints.PROPERTIES);
};

export const getProperty = async (id: number): Promise<GetPropertyResponse> => {
  return fetchData(
    endpoints.PROPERTY_BY_ID.replace(":propertyId", id.toString()),
  );
};
