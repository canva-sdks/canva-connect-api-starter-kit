import { BACKEND_HOST } from "src/config";

import type { UserProfileResponse } from "@canva/connect-api-ts";

export const enum Endpoints {
  AUTHORIZE = "/authorize",
  REVOKE = "/revoke",
  DUMMY_POST = "/dummy/post",
  DUMMY_GET = "/dummy/get",
  USER = "/user",
}

export const getUser = async (): Promise<UserProfileResponse> => {
  return fetchData(Endpoints.USER);
};

export async function fetchData<T>(endpoint: Endpoints): Promise<T> {
  const url = new URL(endpoint, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });

  if (response.ok) {
    return (await response.json()) as T;
  }

  return Promise.reject(`Error ${response.status}: ${response.statusText}`);
}
