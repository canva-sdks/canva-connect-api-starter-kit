import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import assetRoutes from "./routes/asset";
import authRoutes from "./routes/auth";
import autofillRoutes from "./routes/autofill";
import brandTemplateRoutes from "./routes/brand-template";
import designRoutes from "./routes/design";
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import returnNavRoutes from "./routes/return-nav";
import exportRoutes from "./routes/export";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../common/backend/middleware/errors";
import type { client } from "@hey-api/client-fetch";
import { logger } from "../../common/backend/middleware/logger";

/**
 * We extend the Express Request interface to include the custom properties
 * that will be injected by the `injectClient` middleware on routes where
 * that is added (which should be all authenticated routes).
 */
declare global {
  namespace Express {
    interface Request {
      // The Canva Connect client, configured for the current user
      client: typeof client;
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

app.use(errorHandler);
app.use(logger);

// Mount routes
app.use(authRoutes);
app.use(assetRoutes);
app.use(autofillRoutes);
app.use(designRoutes);
app.use(brandTemplateRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(returnNavRoutes);
app.use(exportRoutes);

app.set(
  "views",
  path.join(__dirname, "..", "..", "common", "backend", "views"),
);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Ecommerce shop backend listening on port ${port}`);
});
