import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import assetRoutes from "./routes/asset";
import authRoutes from "./routes/auth";
import autofillRoutes from "./routes/autofill";
import brandTemplateRoutes from "./routes/brand-template";
import designRoutes from "./routes/design";
import userRoutes from "./routes/user";
import propertyRoutes from "./routes/property";
import brokerRoutes from "./routes/broker";
import returnNavRoutes from "./routes/return-nav";
import exportRoutes from "./routes/export";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../common/backend/middleware/errors";
import type { Client } from "@hey-api/client-fetch";
import { logger } from "../../common/backend/middleware/logger";
import flyerRoutes from "./routes/flyer";
import { db } from "./database/database";
import { injectClient } from "../../common/backend/middleware/client";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * We extend the Express Request interface to include the custom properties
 * that will be injected by the `injectClient` middleware on routes where
 * that is added (which should be all authenticated routes).
 */
declare global {
  namespace Express {
    interface Request {
      // The Canva Connect client, configured for the current user
      client: Client;
      // The access token, in case you need to make a call to the
      // Connect API that isn't yet supported by the client
      token: string;
    }
  }
}

const port = process.env.BACKEND_PORT;

if (!port) {
  throw new Error("'BACKEND_PORT' env variable not found.");
}

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(bodyParser.json());
// By supplying a secret to the cookie parser, we are enabling signed cookies
// https://github.com/expressjs/cookie-parser?tab=readme-ov-file#cookieparsersecret-options
// In production, use a separate secret from the database encryption key!
app.use(cookieParser(process.env.DATABASE_ENCRYPTION_KEY));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(logger);

/**
 * Authentication Middleware
 *
 * This central middleware handles authentication for all routes.
 * It follows the Express best practice of having a single point
 * for authentication logic rather than scattered across route files.
 *
 * How it works:
 * 1. Define a list of public paths that don't require auth
 * 2. For each request, check if the path is public
 * 3. If public, skip auth and proceed to the next middleware
 * 4. If protected, apply the auth middleware
 *
 * This approach provides several benefits:
 * - Single source of truth for auth requirements
 * - Easy to maintain and update auth requirements
 * - No risk of middleware leaking between routers
 * - Clear separation between public and protected routes
 */

// Public paths that don't need authentication
const publicPaths = [
  // Data access routes (read-only)
  "/properties",
  "/brokers",

  // Static assets
  "/public",

  // Auth flow routes
  "/oauth/redirect",
  "/authorize",
  "/success",
  "/failure",
  "/isauthorized",
  "/revoke",

  // Navigation routes
  "/return-nav",
];

// Apply authentication middleware only to routes that need it
app.use((req, res, next) => {
  // Check if the path starts with any of our public paths
  const isPublicRoute = publicPaths.some(
    (path) => req.path === path || req.path.startsWith(`${path}/`),
  );

  if (isPublicRoute) {
    // If it's a public route, skip authentication
    console.log(`[Auth] Skipping auth for public route: ${req.path}`);
    return next();
  }

  // For all other routes, apply authentication
  console.log(`[Auth] Applying auth for protected route: ${req.path}`);
  injectClient(req, res, next, db);
});

// Mount routes
app.use(authRoutes);
app.use(assetRoutes);
app.use(autofillRoutes);
app.use(designRoutes);
app.use(brandTemplateRoutes);
app.use(userRoutes);
app.use(propertyRoutes);
app.use(brokerRoutes);
app.use(returnNavRoutes);
app.use(exportRoutes);
app.use(flyerRoutes);

// Error handling middleware should be last
app.use(errorHandler);

app.set(
  "views",
  path.join(__dirname, "..", "..", "common", "backend", "views"),
);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Brix & Hart backend listening on port ${port}`);
});
