export * from "./auth";

import type { Client } from "@hey-api/client-fetch";
import { createClient } from "@hey-api/client-fetch";
import { Users } from "./user";

export type Services = {
  users: Users;
  client: Client;
};

export function createUserClient(token?: string) {
  const localClient = createClient({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    baseUrl: process.env.BASE_CANVA_CONNECT_API_URL,
  });

  localClient.interceptors.response.use((res) => {
    const requestId = res.headers.get("x-request-id");
    if (res.status >= 400) {
      console.warn(
        `Response status ${res.status} on ${res.url}: request id: ${requestId}}`,
      );
    } else {
      console.log(
        `Response status ${res.status} on ${res.url}: request id: ${requestId}`,
      );
    }
    return res;
  });

  return localClient;
}

export const installServices = (token?: string): Services => {
  const client = createUserClient(token);
  const users = new Users(client);

  return {
    users,
    client,
  };
};
