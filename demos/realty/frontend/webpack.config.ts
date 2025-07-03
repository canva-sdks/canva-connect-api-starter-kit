import * as path from "path";
import * as TerserPlugin from "terser-webpack-plugin";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { DefinePlugin } from "webpack";
import * as cssnano from "cssnano";

export function buildConfig({
  appEntry = path.join(__dirname, "src", "index.tsx"),
}: {
  appEntry?: string;
} = {}): Configuration & DevServerConfiguration {
  return {
    mode: "development",
    context: path.resolve(__dirname, "./"),
    entry: {
      app: appEntry,
    },
    target: "web",
    resolve: {
      alias: {
        styles: path.resolve(__dirname, "styles"),
        src: path.resolve(__dirname, "src"),
      },
      extensions: [".ts", ".tsx", ".js", ".css", ".svg", ".woff", ".woff2"],
    },
    infrastructureLogging: {
      level: "none",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [cssnano({ preset: "default" })],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg)$/i,
          type: "asset/inline",
        },
        {
          test: /\.(woff|woff2)$/,
          type: "asset/inline",
        },
        {
          test: /\.svg$/,
          oneOf: [
            {
              issuer: /\.[jt]sx?$/,
              use: ["@svgr/webpack"],
            },
            {
              type: "asset/resource",
              parser: {
                dataUrlCondition: {
                  maxSize: 200,
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [cssnano({ preset: "default" })],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
      ],
    },
    output: {
      filename: `bundle.js`,
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    plugins: [
      new DefinePlugin({
        // Expose the base URLs the frontend needs to make requests to the backend
        // do not expose all of process.env, only the ones needed by the frontend
        "process.env": JSON.stringify({
          BACKEND_URL: process.env.BACKEND_URL,
          BASE_CANVA_CONNECT_API_URL: process.env.BASE_CANVA_CONNECT_API_URL,
        }),
      }),
    ],
    devtool: "source-map",
    devServer: {
      port: 3000,
      compress: true,
      client: {
        logging: "verbose",
      },
      static: {
        directory: path.join(__dirname, "public"),
      },
    },
  };
}

export default buildConfig;
