import type { BaseDatabaseSchema } from "../../../common/backend/database/schema";
import type { Property, Broker, FlyerDesign } from "@realty-demo/shared-models";

export type DatabaseSchema = BaseDatabaseSchema & {
  properties: Property[];
  brokers: Broker[];
  flyers: FlyerDesign[];
};
