import { JSONFileDatabase } from "../database/database";
import { getAccessTokenForUser } from "./client";
import type { NextFunction, Request, Response } from "express";

export const AUTH_COOKIE_NAME = "aut";
export const OAUTH_STATE_COOKIE_NAME = "oas";
export const OAUTH_CODE_VERIFIER_COOKIE_NAME = "ocv";

export const cookieAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  db: JSONFileDatabase,
) => {
  try {
    const token = await getAccessTokenForUser(
      req.signedCookies[AUTH_COOKIE_NAME],
      db,
    );
    req.token = token;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

/**
 * Generates an authorization URL for Canva OAuth flow.
 * @param {string} redirectUri - The redirect URI after authorization.
 * @param {string} state - The CSRF-protection state parameter
 * The state parameter will be returned to you after successful authorization.
 * You need to set something here, so that when it's returned, you can verify
 * that you started the flow (and this is the correct user etc).
 * @param {string} codeChallenge - The PKCE code-challenge value
 * @returns {Promise<string>} The authorization URL.
 */
export function getAuthorizationUrl(
  redirectUri: string,
  state: string,
  codeChallenge: string,
): string {
  const scopes = [
    "asset:read",
    "asset:write",
    "brandtemplate:content:read",
    "brandtemplate:meta:read",
    "design:content:read",
    "design:content:write",
    "design:meta:read",
    "profile:read",
  ];
  const scopeString = scopes.join(" ");

  const clientId = process.env.CANVA_CLIENT_ID;
  const authBaseUrl = process.env.BASE_CANVA_CONNECT_AUTH_URL;

  if (!clientId) {
    throw new Error("'CANVA_CLIENT_ID' env variable not found.");
  }

  if (!authBaseUrl) {
    throw new Error("'BASE_CANVA_CONNECT_AUTH_URL' env variable not found.");
  }

  const url = new URL(`${authBaseUrl}/oauth/authorize`);
  url.searchParams.append("code_challenge", codeChallenge);
  url.searchParams.append("code_challenge_method", "S256");
  url.searchParams.append("scope", scopeString);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("state", state);

  return url.toString();
}
