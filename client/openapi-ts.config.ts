import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../openapi/spec.yml",
  experimentalParser: true,
  output: {
    path: "./ts",
    format: "prettier",
    lint: "eslint",
  },
  plugins: [
    {
      name: "@hey-api/client-fetch",
    },
    {
      name: "@hey-api/sdk",
      asClass: true,
      classNameBuilder: (name) => `${name}Service`,
    },
    {
      name: "@hey-api/typescript",
      enums: "javascript",
    },
  ],
});
