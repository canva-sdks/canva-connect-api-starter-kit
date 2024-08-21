import express from "express";
import * as jose from "jose";

const router = express.Router();

const endpoints = {
  BACKEND_RETURN_NAV: "/return-nav",
  FRONTEND_RETURN_NAV: "/#/return-nav",
};

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const publicKeysURL = new URL(
      "rest/v1/connect/keys",
      process.env.BASE_CANVA_CONNECT_API_URL,
    );
    const JWKS = jose.createRemoteJWKSet(publicKeysURL);
    const { protectedHeader } = await jose.jwtVerify(token, JWKS, {
      audience: process.env.CANVA_CLIENT_ID,
    });
    return !!protectedHeader;
  } catch (error) {
    console.error("Failed to verify correlation_jwt:", error);
    return false;
  }
};

router.get(endpoints.BACKEND_RETURN_NAV, async (req, res) => {
  const correlationJwt = req.query.correlation_jwt;

  if (typeof correlationJwt !== "string") {
    console.log("Error: url search query 'correlation_jwt' was not found.");
    return res.sendStatus(400).json(); // bad request
  }

  const isVerified = await verifyToken(correlationJwt);

  if (!isVerified) {
    console.log("Unable to process Return Nav request.");
    return res.sendStatus(400).json(); // bad request
  }

  /**
   * For more info on the parsed and decoded JWT refer to the canva.dev docs:
   * https://www.canva.dev/docs/connect/return-navigation-guide/#step-3-parse-the-return-url
   */
  const parsedJwt = jose.decodeJwt(correlationJwt);

  const designId = parsedJwt.design_id as string;
  const correlationState = parsedJwt.correlation_state as string;

  const returnNavBase = new URL(
    endpoints.FRONTEND_RETURN_NAV,
    process.env.FRONTEND_URL,
  ).toString();

  const frontendReturnNavUrl = `${returnNavBase}?design_id=${designId}&correlation_state=${correlationState}`;

  res.redirect(frontendReturnNavUrl);
});

export default router;
