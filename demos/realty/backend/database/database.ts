import type { DatabaseSchema } from "./schema";
import { properties } from "../services/properties";
import { brokers } from "../services/broker";
import { JSONFileDatabase } from "../../../common/backend/database/database";

/**
 * Set up a database with "properties", "brokers", "users", and "flyers" tables. In this example code, the
 * database is simply a JSON file.
 */
const db = new JSONFileDatabase<DatabaseSchema>(
  { properties, brokers, users: [], flyers: [] },
  __dirname,
);

export { db };
