#!/usr/bin/env node
import "dotenv/config";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { AppRunner } from "../../common/scripts/app-runner";
import { validateEnvironmentVariables } from "../../common/scripts/env";
import { Context } from "../../common/scripts/context";
import { buildConfig } from "../frontend/webpack.config";
import * as path from "path";

const appRunner = new AppRunner();

validateEnvironmentVariables();

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .command(
    "$0",
    "Starts local development",
    () => {},
    () => {
      const ctx = new Context(path.join(__dirname, ".."));
      appRunner.run(ctx, buildConfig);
    },
  )
  .parse();
