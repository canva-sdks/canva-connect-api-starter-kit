# Canva Connect API Starter Kit

Welcome to the **Connect API starter kit** for Canva's developers platform. 🎉

This repo contains our OpenAPI specifications, as well as a demo ecommerce web application built with the Connect API. The complete documentation for the platform is at [canva.dev/docs/connect](https://www.canva.dev/docs/connect/).

## Requirements

- Node.js `v24`
- npm `v11`

**Note:** To make sure you're running the correct version of Node.js, we recommend using a version manager, such as [nvm](https://github.com/nvm-sh/nvm#intro). The [.nvmrc](/.nvmrc) file in the root directory of this repo will ensure the correct version is used once you run `nvm install`.

## OpenAPI Spec

The Canva Connect API doesn't maintain nor publish client SDKs, however, we have made our [OpenAPI spec](./openapi/spec.yml) publicly available, so you can use it with your favorite code generation library, such as [openapi-generator](https://github.com/OpenAPITools/openapi-generator) to generate client SDKs in your language of choice!

To demonstrate this, we're using [openapi-ts](https://www.npmjs.com/package/@hey-api/openapi-ts) to generate TypeScript SDKs in [client/ts](./client/ts/) which is used in our demo app.

To refresh the checked-in OpenAPI description, then regenerate the TypeScript client:

```bash
npm run openapi:download
npm run openapi:generate
```

## Demos: E-commerce Shop

### Prerequisites

Before you can run this demo, you'll need to do some setup beforehand.

1. Open [Your apps](https://www.canva.com/developers/apps) in the Developer Portal and click **Create an app**. Enter an app name and choose who can use your app.

2. In your app, go to **Outside Canva** and click **Start integrating**. On **Outside Canva → Configuration**, under **Integration methods**, make sure **Canva REST APIs** is turned on.

3. Under **Credentials** on the same page, copy the **Client ID**. Click **Generate secret** and store the secret securely. You'll need both values when configuring the demo.

4. Under **Integration methods → Canva REST APIs → Scopes**, select:
   - `asset`: Read and Write.
   - `brandtemplate:content`: Read.
   - `brandtemplate:meta`: Read.
   - `design:content`: Read and Write.
   - `design:meta`: Read.
   - `profile`: Read.

5. On **Outside Canva → Redirect URLs**, enter the following value for **URL 1**:

   ```
   http://127.0.0.1:3001/oauth/redirect
   ```

6. On **Outside Canva → Configuration**, under **Integration methods → Canva REST APIs → Return navigation**, turn on return navigation and enter the following **Return URL**:

   ```
   http://127.0.0.1:3001/return-nav
   ```

### How to run

1. Install dependencies

```bash
npm install
cd demos/ecommerce_shop
```

2. Add your integration settings to the `demos/ecommerce_shop/.env` file.

- `DATABASE_ENCRYPTION_KEY`: This will encrypt and decrypt the tokens stored in the JSON database. A key is automatically generated for you after running `npm install`, and will already be set in `.env`. If not, run `npm run generate:db-key` from the `demos/ecommerce_shop` directory.
- `CANVA_CLIENT_ID`: This is the `Client ID` from the prerequisites.
- `CANVA_CLIENT_SECRET`: This is the `client secret` you generated in the prerequisites.

3. Run the app

```bash
npm start
```

> [!WARNING]
> Accessing the app via `localhost:3000` will throw CORS errors, you must access the app via the below URL.

4. View your app: [http://127.0.0.1:3000](http://127.0.0.1:3000)

### Brand Templates Setup

To get started with Brand Templates in the e-commerce demo, you can install sample templates from [this Brand Template deck](https://www.canva.com/design/DAGGkcb61HQ/OJhMIQrmz2daIoxo8u3T2g/view).

## Demos: Real-estate demo

### Prerequisites

Before you can run this demo, you'll need to do some setup beforehand.

1. Open [Your apps](https://www.canva.com/developers/apps) in the Developer Portal and click **Create an app**. Enter an app name and choose who can use your app.

2. In your app, go to **Outside Canva** and click **Start integrating**. On **Outside Canva → Configuration**, under **Integration methods**, make sure **Canva REST APIs** is turned on.

3. Under **Credentials** on the same page, copy the **Client ID**. Click **Generate secret** and store the secret securely. You'll need both values when configuring the demo.

4. Under **Integration methods → Canva REST APIs → Scopes**, select:
   - `asset`: Read and Write.
   - `brandtemplate:content`: Read.
   - `brandtemplate:meta`: Read.
   - `design:content`: Read and Write.
   - `design:meta`: Read.
   - `profile`: Read.

5. On **Outside Canva → Redirect URLs**, enter the following value for **URL 1**:

   ```
   http://127.0.0.1:3001/oauth/redirect
   ```

6. On **Outside Canva → Configuration**, under **Integration methods → Canva REST APIs → Return navigation**, turn on return navigation and enter the following **Return URL**:

   ```
   http://127.0.0.1:3001/return-nav
   ```

### How to run

1. Install dependencies

```bash
npm install
cd demos/realty
```

2. Add your integration settings to the `demos/realty/.env` file.

- `DATABASE_ENCRYPTION_KEY`: This will encrypt and decrypt the tokens stored in the JSON database. A key is automatically generated for you after running `npm install`, and will already be set in `.env`. If not, run `npm run generate:db-key` from the `demos/realty` directory.
- `CANVA_CLIENT_ID`: This is the `Client ID` from the prerequisites.
- `CANVA_CLIENT_SECRET`: This is the `client secret` you generated in the prerequisites.

3. Run the app

```bash
npm start
```

> [!WARNING]
> Accessing the app via `localhost:3000` will throw CORS errors, you must access the app via the below URL.

4. View your app: [http://127.0.0.1:3000](http://127.0.0.1:3000)

### Brand Templates Setup

To get started with Brand Templates in the real estate demo, you can install sample templates from [this Brand Template deck](https://www.canva.com/design/DAGGkcb61HQ/OJhMIQrmz2daIoxo8u3T2g/view).

## Demos: Connect API Playground

### Prerequisites

Before you can run this demo, you'll need to do some setup beforehand.

1. Open [Your apps](https://www.canva.com/developers/apps) in the Developer Portal and click **Create an app**. Enter an app name and choose who can use your app.

2. In your app, go to **Outside Canva** and click **Start integrating**. On **Outside Canva → Configuration**, under **Integration methods**, make sure **Canva REST APIs** is turned on.

3. Under **Credentials** on the same page, copy the **Client ID**. Click **Generate secret** and store the secret securely. You'll need both values when configuring the demo.

4. Under **Integration methods → Canva REST APIs → Scopes**, select any permissions for endpoints you'd like to experiment with, plus:
   - `profile`: Read.

5. On **Outside Canva → Redirect URLs**, enter the following value for **URL 1**:

   ```
   http://127.0.0.1:3001/oauth/redirect
   ```

### How to run

1. Install dependencies

```bash
npm install
cd demos/playground
```

2. Add your integration settings to the `demos/playground/.env` file.

- `DATABASE_ENCRYPTION_KEY`: This will encrypt and decrypt the tokens stored in the JSON database. A key is automatically generated for you after running `npm install`, and will already be set in `.env`.
- `CANVA_CLIENT_ID`: This is the `Client ID` from the prerequisites.
- `CANVA_CLIENT_SECRET`: This is the `client secret` you generated in the prerequisites.

3. Run the app

```bash
npm start
```

> [!WARNING]
> Accessing the app via `localhost:3000` will throw CORS errors, you must access the app via the below URL.

4. View your app: [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Decision Registry

### Multer

We use [Multer](https://www.npmjs.com/package/multer) in our Express.js app to handle file uploads. It simplifies the process of uploading files and reduces the amount of code required. There are other alternatives to `Multer`, like [express-fileupload](https://www.npmjs.com/package/express-fileupload) that you can use in your own application.

## Helpful Links

[Canva Connect API - Getting Started](https://www.canva.dev/docs/connect/quickstart)
[Canva Connect API - Official Documentation](https://www.canva.dev/docs/connect/)
