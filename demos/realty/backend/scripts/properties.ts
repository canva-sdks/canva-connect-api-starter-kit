#!/usr/bin/env node
import chalk from "chalk";
import Table from "cli-table3";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { db } from "../database/database";

export const infoChalk = chalk.blue.bold;
export const highlightChalk = chalk.greenBright.bold;
export const linkChalk = chalk.cyan;

const readProperties = async () => {
  const data = await db.read();
  return data.properties;
};

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .command(
    "read",
    "Lookup and print the current properties in the database/db.json to the console",
    () => {},
    async () => {
      const currentProperties = await readProperties();
      const table = new Table({
        head: ["id", "address", "price", "imageUrls"],
      });
      currentProperties.forEach((property) => {
        table.push([
          property.id,
          property.address,
          formatCurrency(property.price),
          linkChalk(property.imageUrls[0] || ""),
        ]);
      });
      console.log(table.toString(), "\n");
    },
  )
  .parse();

function formatCurrency(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
