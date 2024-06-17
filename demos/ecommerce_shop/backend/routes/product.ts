import express from "express";
import { db } from "../database/database";

const router = express.Router();

const endpoints = {
  PRODUCTS: "/products",
};

router.get(endpoints.PRODUCTS, async (req, res) => {
  const data = await db.read();

  return res.json({ products: data.products });
});

export default router;
