import { Context } from "./context";
import * as chalk from "chalk";
import * as Table from "cli-table3";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import * as nodemon from "nodemon";

export const infoChalk = chalk.blue.bold;
export const warnChalk = chalk.bgYellow.bold;
export const errorChalk = chalk.bgRed.bold;
export const highlightChalk = chalk.greenBright.bold;
export const linkChalk = chalk.cyan;

export class AppRunner {
  async run(ctx: Context, webpackBuildConfig: () => webpack.Configuration) {
    console.log(
      infoChalk("Info:"),
      `Starting development server for ${highlightChalk(ctx.srcDir)}\n`,
    );

    const table = new Table();

    const server = await this.runWebpackDevServer(
      ctx,
      table,
      webpackBuildConfig,
    );

    await this.runBackendServer(ctx, table, server);

    console.log(table.toString(), "\n");
  }

  private readonly runBackendServer = async (
    ctx: Context,
    table: Table.Table,
    webpackDevServer: WebpackDevServer,
  ) => {
    await new Promise((resolve) => {
      const nodemonServer = nodemon({
        script: ctx.backendEntry,
        ext: "ts",
      });

      nodemonServer.on("start", resolve);

      nodemonServer.on("crash", async () => {
        console.log(errorChalk("Shutting down local server.\n"));

        await webpackDevServer.stop();
        process.exit(1);
      });
    });

    table.push(["Base URL (Backend)", linkChalk(ctx.backendUrl)]);
  };

  private readonly runWebpackDevServer = async (
    ctx: Context,
    table: Table.Table,
    buildConfig: () => webpack.Configuration,
  ): Promise<WebpackDevServer> => {
    const runtimeWebpackConfig = buildConfig();

    const compiler = webpack(runtimeWebpackConfig);
    const server = new WebpackDevServer(
      runtimeWebpackConfig.devServer,
      compiler,
    );
    await server.start();

    table.push(["Development URL (Frontend)", linkChalk(ctx.frontendUrl)]);

    return server;
  };
}
