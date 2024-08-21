#!/usr/bin/env node
import * as yargs from "yargs";
import * as env from "envfile";
import * as fs from "node:fs/promises";
import { hideBin } from "yargs/helpers";

export async function generateKey(args: yargs.Arguments) {
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  const encodedKey = Buffer.from(key).toString("base64");

  if (args.save) {
    const config = await fs.readFile(".env", { encoding: "utf8" });
    const current = env.parse(config);
    const replacement = env.stringify({
      ...current,
      DATABASE_ENCRYPTION_KEY: encodedKey,
    });
    await fs.writeFile(".env", replacement);
  } else {
    console.log(encodedKey);
  }
}

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .option("save", {
    description: "Save the generated key to your .env file.",
    type: "boolean",
    // npm swallows command line args instead of forwarding to the script
    default: process.env.npm_config_save?.toLocaleLowerCase().trim() === "true",
  })
  .command(
    "$0",
    "Generates an AES-256 key for encrypting tokens in the database.",
    () => {},
    async (args) => {
      await generateKey(args);
    },
  )
  .parse();
