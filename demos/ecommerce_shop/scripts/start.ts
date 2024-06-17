#!/usr/bin/env node
import "dotenv/config";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { AppRunner } from "./app-runner";
import { Context } from "./context";
import { validateEnvironmentVariables } from "./env";

const appRunner = new AppRunner();

validateEnvironmentVariables();

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .option("ngrok", {
    description: "Run backend server via ngrok.",
    type: "boolean",
    // npm swallows command line args instead of forwarding to the script
    default:
      process.env.npm_config_ngrok?.toLocaleLowerCase().trim() === "true",
  })
  .command(
    "$0",
    "Starts local development",
    () => {},
    (args) => {
      const ctx = new Context(args);
      appRunner.run(ctx);
    },
  )
  .parse();
