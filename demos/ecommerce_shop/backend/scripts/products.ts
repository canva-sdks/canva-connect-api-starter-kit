#!/usr/bin/env node
import chalk from "chalk";
import Table from "cli-table3";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { db } from "../database/database";
import type { Product } from "../models";

export const infoChalk = chalk.blue.bold;
export const highlightChalk = chalk.greenBright.bold;
export const linkChalk = chalk.cyan;

const readProducts = async () => {
  const data = await db.read();
  return data.products;
};

/**
 * resetProductsCanvaDesigns() - Takes in products and writes back products with
 * emptied canvaDesigns.
 * @param products: the current products db.
 * @returns the products that had existing canvaDesigns that were removed.
 */
const resetProductsCanvaDesigns = async (
  products: Product[],
): Promise<Product[]> => {
  const productsWithCanvaDesigns = products.filter((p) => p.canvaDesign);
  const newProducts = products.map((product) => {
    return { ...product, canvaDesign: undefined };
  });
  const data = await db.read();
  await db.write({ products: newProducts, users: data.users });
  return productsWithCanvaDesigns;
};

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .command(
    "read",
    "Lookup and print the current products in the database/db.json to the console",
    () => {},
    async () => {
      const currentProducts = await readProducts();
      const table = new Table({
        head: ["id", "name", "imageUrl", "canvaDesign.designExportUrl"],
      });
      currentProducts.forEach((product) => {
        table.push([
          product.id,
          product.name,
          linkChalk(product.imageUrl),
          linkChalk(product.canvaDesign?.designExportUrl),
        ]);
      });
      console.log(table.toString(), "\n");
    },
  )
  .command(
    "reset",
    "Resets products in the database/db.json clearing any canvaDesigns.",
    () => {},
    async () => {
      const currentProducts = await readProducts();
      const cleansedDesigns = await resetProductsCanvaDesigns(currentProducts);

      console.log(
        infoChalk("Info:"),
        `Resetting ${highlightChalk(cleansedDesigns.length)} products with canvaDesigns.\n`,
      );
    },
  )
  .parse();
