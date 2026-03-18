# Changelog

## 2026-03-19

### 🔧 Changed

- Upgraded `@hey-api/openapi-ts` to `0.85.2` and regenerated the Connect SDK. The demos now import from `@canva/connect-api-ts/client` instead of `@hey-api/client-fetch`.
- Dependencies audit bringing modules up to date:

```text
@types/jest                              29.5.14   ->   30.0.0
axios                                     1.12.2   ->   1.13.6
jest                                      29.7.0   ->   30.2.0
jest-environment-jsdom                    29.7.0   ->   30.2.0
multer                                     2.0.2   ->   2.1.1
terser-webpack-plugin                     5.3.14   ->   5.4.0
```

## 2026-02-27

### 🔧 Changed

- Refreshed the OpenAPI yml spec `openapi/spec.yml` to be based on the latest Connect API

## 2026-01-15

### 🔧 Changed

- Dependencies audit bringing modules up to date:

```text
react-router-dom                               7.8.2   ->   7.12.0
```

## 2026-01-08

### 🔧 Changed

- Upgraded `react` and `react-dom` to `19.2.3`.

## 2025-12-11

### 🔧 Changed

- Updated `react` and `react-dom` to `19.2.1`.

## 2025-12-08

### 🔧 Changed

- Updated `express`, `js-yaml` and `node-forge` dev/transitive dependencies

### 🗑️ Removed

- Removed the `eslint-plugin-unicorn` dev dependency as it was unused

## 2025-11-20

### 🐞 Fixed

- Removed incorrect `node_modules/@types/` include from tsconfig.json.

## 2025-11-13

### 🔧 Changed

- Update brand template ID migration warning message

## 2025-10-16

### 🔧 Changed

- Updated react and react-dom to v19
- Updated React to 19.2.0.

### 🐞 Fixed

- Updated `react` dependencies to use ^ (compatible with) to reduce the impact of `@canva package` updates with react peer dependencies.

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
