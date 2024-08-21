const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { optimize } = require("webpack");

function buildConfig({
  appEntry = path.join(__dirname, "src", "index.tsx"),
} = {}) {
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
                  plugins: [require("cssnano")({ preset: "default" })],
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
              resourceQuery: /react/, // *.svg?react
              use: ["@svgr/webpack", "url-loader"],
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
                  plugins: [require("cssnano")({ preset: "default" })],
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
      new optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    ],
    devtool: "source-map",
    devServer: {
      port: 3000,
      compress: true,
      client: {
        logging: "verbose",
      },
      static: {
        directory: path.join(__dirname, 'public'),
      },
    },
  };
}

module.exports = () => buildConfig();

module.exports.buildConfig = buildConfig;
