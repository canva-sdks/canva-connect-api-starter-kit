import express from "express";
import { db } from "../database/database";
import type { Product, UpsertProductDesignRequest } from "../models";

const router = express.Router();

export const writeProduct = async (newProduct: Product): Promise<Product[]> => {
  const data = await db.read();
  const filteredProducts = data.products.filter((p) => p.id !== newProduct.id);

  // Insert updated product and sort in order of product.id, to
  // ensure the fetching of products doesn't jump around in order.
  const newProducts = [...filteredProducts, newProduct].sort(
    (a, b) => a.id - b.id,
  );
  await db.write({ products: newProducts, users: data.users });
  return newProducts;
};

const endpoints = {
  PRODUCTS: "/products",
  UPSERT_PRODUCT_DESIGN: "/products/:id/design",
};

router.get(endpoints.PRODUCTS, async (req, res) => {
  const data = await db.read();

  return res.json({ products: data.products });
});

router.put(endpoints.UPSERT_PRODUCT_DESIGN, async (req, res) => {
  const canvaDesign: UpsertProductDesignRequest = req.body;

  const data = await db.read();
  const product = data.products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json();
  }

  const newProducts = await writeProduct({ ...product, canvaDesign });

  return res.json({ products: newProducts });
});

export default router;
