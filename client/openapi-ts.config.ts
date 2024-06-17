import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: '../openapi/spec.yml',
  client: '@hey-api/client-fetch',
  output: {
    path: './ts',
    format: 'prettier',
    lint: 'eslint',
  },
  services: {
    asClass: true,
  },
  types: {
    enums: "javascript",
  }
});
