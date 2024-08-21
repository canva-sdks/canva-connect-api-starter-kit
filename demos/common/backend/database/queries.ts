import type { ExchangeAccessTokenResponse } from "@canva/connect-api-ts";
import { decrypt, encrypt } from "../services/crypto";
import { JSONFileDatabase } from "./database";

/**
 * IMPORTANT
 *
 * These queries are for DEMONSTRATION PURPOSES ONLY.
 * In a real application, please use a proper database.
 */

/**
 * getToken - Retrieve the token (if there is one) for a particular user
 * @param cookie The ID of the user, from the cookie in the request
 * @returns The token, if found
 */
export async function getToken(
  cookie: string,
  db: JSONFileDatabase,
): Promise<ExchangeAccessTokenResponse | undefined> {
  const data = await db.read();
  const token = data.users.find((user) => user.id === cookie)?.token;

  if (!token) {
    return;
  }
  const decrypted = await decrypt(token);
  return JSON.parse(decrypted) as ExchangeAccessTokenResponse;
}

/**
 * deleteToken - Delete the token (if there is one) for a particular user
 * you should probably fetch it and revoke it first
 * @param id The ID of the user
 * @returns nothing
 */
export async function deleteToken(
  id: string,
  db: JSONFileDatabase,
): Promise<void> {
  const data = await db.read();
  for (let i = 0; i < data.users.length; i++) {
    const user = data.users[i];
    if (user.id === id) {
      data.users.splice(i, 1);
      await db.write(data);
      return;
    }
  }
}

/**
 * setToken - Save the user's token for later retrieval
 * replacing it if there is already a token for that user
 * @param token The user's token
 * @param id The ID of the user
 * @returns nothing
 */
export async function setToken(
  token: ExchangeAccessTokenResponse,
  id: string,
  db: JSONFileDatabase,
): Promise<void> {
  const encrypted = await encrypt(JSON.stringify(token));
  const data = await db.read();

  const userIndex = data.users.findIndex((user) => user.id === id);
  if (userIndex >= 0) {
    data.users[userIndex].token = encrypted;
  } else {
    data.users.push({
      id,
      token: encrypted,
    });
  }

  await db.write(data);
}
