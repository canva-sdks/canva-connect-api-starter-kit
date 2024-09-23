# Changelog

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
- Changed the ecommerce_shop demo `.env` template format to now include `BASE_CANVA_CONNECT_AUTH_URL`. Older clones of this repo may encounter issues if the below is line is not added to their `demos/ecommerce_shop/.env` file:
  ```text
  BASE_CANVA_CONNECT_AUTH_URL=https://www.canva.com/api
  ```

## 2024-06-17

Initial public release
