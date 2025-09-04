# Changelog

## 2025-09-04

### 🔧 Changed

- Updated TypeScript to version 5.9.2
- Updated dependencies across all demos
- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API

### 🐞 Fixed

- Fixed bug in `demos/realty`: Updated field mapping validation logic to only check for fields that are present in the template being created.
- Fixed compatibility issues with TypeScript 5.9.2 in crypto.ts files

## 2025-07-23

### 🔧 Changed

- Updated the logo to match our Brix&Hart mock brand in `demos/realty`.
- Updated dependencies across all demos

## 2025-07-07

### 🧰 Added

- Added a new real estate integration demo in `demos/realty`.

### 🐞 Fixed

- Several typos in the documentation.

### 🔧 Changed

- Upgraded `webpack-dev-server` to version `5.2.2` from `5.2.0`.
- Updated Brand Template selector components to display Brand Templates download link more prominently.

### 🗑️ Removed

- Removed the `--ngrok` flag which is not required, but could potentially cause issues if certain environment variables are set.

## 2025-05-15

### 🐞 Fixed

- Updated stale getting started docs link.
- Removed duplicate config files with API base URLs, making the environment variables in `.env` the source of truth.

### 🔧 Changed

- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API design.
- Patch and minor version changes to package dependencies in the `ecommerce_shop` and `playground` demos.
- Moved `webpack.config.cjs` to `webpack.config.ts` for type checking.
- Updated file name casing to be consistent, and added an eslint rule to enforce this
- Updated `eslint`, `eslint-plugin-unicorn`, and `typescript-eslint`.

## 2024-12-19

### 🔧 Changed

- Both demo projects now take advantage of the CORS support for the Connect API and make most requests directly from the frontend code
- Updated HeyAPI to version 0.5, and TypeScript to version 5.5
- Dependencies are now pinned to exact versions to reduce accidental incompatibilities
- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API design

## 2024-09-23

### 🔧 Changed

- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API design.

## 2024-09-11

### 🔧 Changed

- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API design.
- `ecommerce_demo`:
  - Added commands to easily reset products in the database to help with testing

## 2024-08-19

### 🧰 Added

- Added a `playground` demo to demonstrate a simple auth-configured starting point to experiment with the Connect APIs.
- Added the `return-navigation` flow to the `ecommerce_shop` demo. For more information around the Return Navigation flow refer to the [Canva Developers Guide](https://www.canva.dev/docs/connect/return-navigation-guide/).

### 🔧 Changed

- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API design.
- Changed the ecommerce_shop demo `.env` template format to now include `BASE_CANVA_CONNECT_AUTH_URL`. Older clones of this repo may encounter issues if the below line is not added to their `demos/ecommerce_shop/.env` file:

  ```text
  BASE_CANVA_CONNECT_AUTH_URL=https://www.canva.com/api
  ```

## 2024-06-17

Initial public release
