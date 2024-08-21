import type { DatabaseSchema } from "./schema";
import { products } from "../services/products";
import { JSONFileDatabase } from "../../../common//backend/database/database";

/**
 * Set up a database with "products" and "users" tables. In this example code, the
 * database is simply a JSON file.
 */
const db = new JSONFileDatabase<DatabaseSchema>(
  { products, users: [] },
  __dirname,
);

export { db };
