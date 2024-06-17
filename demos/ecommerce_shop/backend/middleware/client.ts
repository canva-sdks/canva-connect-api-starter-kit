import { AUTH_COOKIE_NAME } from "../services/auth";
import { getAccessTokenForUser, getUserClient } from "../services/client";
import type { NextFunction, Request, Response } from "express";

export const injectClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = await getAccessTokenForUser(
      req.signedCookies[AUTH_COOKIE_NAME],
    );
    const client = getUserClient(token);
    req.client = client;
    req.token = token;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
  next();
};
