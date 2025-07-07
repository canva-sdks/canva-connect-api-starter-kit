import express from "express";
import { db } from "../database/database";
import type { Property } from "@realty-demo/shared-models";

const router = express.Router();

export const writeProperty = async (
  newProperty: Property,
): Promise<Property[]> => {
  const data = await db.read();
  const filteredProperties = data.properties.filter(
    (p) => p.id !== newProperty.id,
  );

  // Insert updated property and sort in order of property.id, to
  // ensure the fetching of properties doesn't jump around in order.
  const newProperties = [...filteredProperties, newProperty].sort(
    (a, b) => a.id - b.id,
  );
  await db.write({
    properties: newProperties,
    brokers: data.brokers,
    users: data.users,
    flyers: data.flyers || [], // Include flyers array, initialize if not present
  });
  return newProperties;
};

const endpoints = {
  PROPERTIES: "/properties",
  PROPERTY_BY_ID: "/properties/:id",
};

router.get(endpoints.PROPERTIES, async (req, res) => {
  const data = await db.read();
  return res.json({ properties: data.properties });
});

router.get(endpoints.PROPERTY_BY_ID, async (req, res) => {
  const data = await db.read();
  const property = data.properties.find((p) => p.id === Number(req.params.id));

  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }

  return res.json({ property });
});

export default router;
