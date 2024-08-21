import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dummyRoutes from "./routes/dummy";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../common/backend/middleware/errors";
import { logger } from "../../common/backend/middleware/logger";
import { JSONFileDatabase } from "../../common/backend/database/database";
import type { DatabaseSchema } from "./schema";
import type { client } from "@hey-api/client-fetch";

const port = process.env.BACKEND_PORT;

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

export const db = new JSONFileDatabase<DatabaseSchema>(
  { users: [] },
  __dirname,
);

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

app.use(errorHandler);
app.use(logger);

// Mount routes
app.use(authRoutes);
app.use(dummyRoutes);
app.use(userRoutes);

app.set(
  "views",
  path.join(__dirname, "..", "..", "common", "backend", "views"),
);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Playground integration backend listening on port ${port}`);
});
