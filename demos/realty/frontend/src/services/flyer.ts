import type { FlyerDesign } from "@realty-demo/shared-models";
import { fetchData, postData } from "./api";

const endpoints = {
  FLYERS: "/flyers",
  FLYER_BY_ID: "/flyers/:flyerId",
};

export const getMyFlyers = async (): Promise<{ flyers: FlyerDesign[] }> => {
  return fetchData(endpoints.FLYERS);
};

export const saveFlyer = async (
  flyer: Omit<FlyerDesign, "id">,
): Promise<{ flyer: FlyerDesign }> => {
  return postData(endpoints.FLYERS, flyer);
};

export const getFlyer = async (id: string): Promise<FlyerDesign> => {
  return fetchData(endpoints.FLYER_BY_ID.replace(":flyerId", id));
};

export const updateFlyer = async (
  flyerId: string,
  flyer: Partial<FlyerDesign>,
): Promise<FlyerDesign> => {
  return postData(
    endpoints.FLYER_BY_ID.replace(":flyerId", flyerId),
    {
      updatedFlyer: flyer,
    },
    "PUT",
  );
};
