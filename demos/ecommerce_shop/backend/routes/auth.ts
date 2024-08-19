import type { CookieOptions } from "express";
import crypto from "node:crypto";
import express from "express";
import {
  AUTH_COOKIE_NAME,
  OAUTH_CODE_VERIFIER_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  getAuthorizationUrl,
} from "../../../common/backend/services/auth";
import * as jose from "jose";
import {
  deleteToken,
  getToken,
  setToken,
} from "../../../common/backend/database/queries";
import {
  getAccessTokenForUser,
  getBasicAuthClient,
} from "../../../common/backend/services/client";
import { OauthService } from "@canva/connect-api-ts";
import { db } from "../database/database";

const globals: {
  redirectUri: string;
} = {
  redirectUri: "",
};

const router = express.Router();

const endpoints = {
  REDIRECT: "/oauth/redirect",
  SUCCESS: "/success",
  FAILURE: "/failure",
  AUTHORIZE: "/authorize",
  IS_AUTHORIZED: "/isauthorized",
  REVOKE: "/revoke",
};

globals.redirectUri = new URL(
  endpoints.REDIRECT,
  process.env.BACKEND_URL,
).toString();

router.get(endpoints.REDIRECT, async (req, res) => {
  const authorizationCode = req.query.code;
  const state = req.query.state;
  if (typeof authorizationCode !== "string" || typeof state !== "string") {
    const params = new URLSearchParams({
      error:
        typeof req.query.error === "string" ? req.query.error : "Unknown error",
    });
    return res.redirect(`${endpoints.FAILURE}?${params.toString()}`);
  }

  try {
    if (state !== req.signedCookies[OAUTH_STATE_COOKIE_NAME]) {
      throw new Error(
        `Invalid state ${state} != ${req.signedCookies[OAUTH_STATE_COOKIE_NAME]}`,
      );
    }

    const codeVerifier = req.signedCookies[OAUTH_CODE_VERIFIER_COOKIE_NAME];

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
      code: authorizationCode,
      redirect_uri: globals.redirectUri,
    });

    const result = await OauthService.exchangeAccessToken({
      client: getBasicAuthClient(),
      body: params,
      // by default, the body is JSON stringified, but given this endpoint expects form URL encoded data
      // we need to override the `bodySerializer`
      bodySerializer: (params) => params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (result.error) {
      return res.status(result.response.status).json(result.error);
    }

    const token = result.data;
    if (!token) {
      throw new Error(
        "No token returned when exchanging oauth code for token, but no error was returned either.",
      );
    }

    const claims = jose.decodeJwt(token.access_token);
    const claimsSub = claims.sub;
    if (!claimsSub) {
      throw new Error("Unable to extract claims sub from access token.");
    }

    res.cookie(AUTH_COOKIE_NAME, claimsSub, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      // SameSite default is "lax"; for cookies used for authentication it should be
      // "strict" but while in development "lax" is more convenient.
      // We can't use "none", even in development, because that requires Secure, which
      // requires https, which we don't want to set up for local development.
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      signed: true,
    });
    await setToken(token, claimsSub, db);

    return res.redirect(endpoints.SUCCESS);
  } catch (error) {
    console.error(error);
    const url = new URL(endpoints.FAILURE, process.env.BACKEND_URL);
    if (error instanceof Error) {
      url.searchParams.append("error", error.message || error.toString());
    }
    return res.redirect(url.toString());
  }
});

router.get(endpoints.SUCCESS, async (req, res) => {
  res.render("auth_success", {
    countdownSecs: 2,
    message: "authorization_success",
  });
});

router.get(endpoints.FAILURE, async (req, res) => {
  res.render("auth_failure", {
    countdownSecs: 10,
    message: "authorization_error",
    errorMessage: req.query.error || "Unknown error",
  });
});

router.get(endpoints.AUTHORIZE, async (req, res) => {
  const codeVerifier = crypto.randomBytes(96).toString("base64url");
  // We use random data for the state for CSRF prevention.
  // You *can* use the state parameter to store user state (such as the current page) as well, if you like
  const state = crypto.randomBytes(96).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest()
    .toString("base64url");

  const url = getAuthorizationUrl(globals.redirectUri, state, codeChallenge);
  const cookieConfiguration: CookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 20, // 20 minutes
    sameSite: "lax", // since we will be redirecting back from Canva, we need the cookies to be sent with every request to our domain
    secure: process.env.NODE_ENV === "production",
    signed: true,
  };
  return (
    res
      // By setting the state as a cookie, we bind it to the user agent.
      // https://portswigger.net/web-security/csrf/preventing
      // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
      .cookie(OAUTH_STATE_COOKIE_NAME, state, cookieConfiguration)
      // We set the code verifier as a cookie for convenience in this example.
      // It could also be stored in the database.
      .cookie(
        OAUTH_CODE_VERIFIER_COOKIE_NAME,
        codeVerifier,
        cookieConfiguration,
      )
      .redirect(url)
  );
});

router.get(endpoints.REVOKE, async (req, res) => {
  const user = req.signedCookies[AUTH_COOKIE_NAME];
  const token = await getToken(user, db);

  res.clearCookie(AUTH_COOKIE_NAME);
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const client_id = process.env.CANVA_CLIENT_ID;
    if (!client_id) {
      throw new Error("'CANVA_CLIENT_ID' env variable is undefined");
    }

    const client_secret = process.env.CANVA_CLIENT_SECRET;
    if (!client_secret) {
      throw new Error("'CANVA_CLIENT_SECRET' env variable is undefined");
    }

    const params = new URLSearchParams({
      client_secret,
      client_id,
      // Revoking the refresh token revokes the consent and the access token,
      // this is the way for Connect API clients to disconnect users.
      token: token.refresh_token,
    });

    await OauthService.revokeTokens({
      client: getBasicAuthClient(),
      // by default, the body is JSON stringified, but given this endpoint expects form URL encoded data
      // we need to override the `bodySerializer`
      body: params,
      bodySerializer: (params) => params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  } finally {
    await deleteToken(user, db);
  }
  return res.sendStatus(200);
});

/**
 * Endpoint handler for checking authorization status.
 *
 * Note: This endpoint is intended for demonstration purposes only and should NOT
 * be used in a production environment. It provides a simplified mechanism to
 * simulate authorization status based on a global variable.
 */
router.get(endpoints.IS_AUTHORIZED, async (req, res) => {
  const auth = req.signedCookies[AUTH_COOKIE_NAME];
  try {
    await getAccessTokenForUser(auth, db);
    return res.json({ status: true });
  } catch (error) {
    return res.sendStatus(404);
  }
});

export default router;
