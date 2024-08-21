import type { BaseDatabaseSchema } from "../../../common/backend/database/schema";
import type { Product } from "../models";

export type DatabaseSchema = BaseDatabaseSchema & {
  products: Product[];
};
