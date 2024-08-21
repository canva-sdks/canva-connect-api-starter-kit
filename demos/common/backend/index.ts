import type { client } from "@hey-api/client-fetch";

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
