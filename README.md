# Canva Connect API Starter Kit

Welcome to the **Connect API starter kit** for Canva's developers platform. 🎉

This repo contains our openAPI specifications, as well as a demo ecommerce web application built with the Connect API. The complete documentation for the platform is at [canva.dev/docs/connect](https://www.canva.dev/docs/connect/).

## OpenAPI Spec

The Canva Connect API doesn't maintain nor publish client SDKs, however, we have made our [OpenAPI spec](./openapi/spec.yml) publicly available, so you can use it with your favorite code generation library, such as [openapi-generator](https://github.com/OpenAPITools/openapi-generator) to generate client SDKs in your language of choice!

To demonstrate this, we're using [openapi-ts](https://www.npmjs.com/package/@hey-api/openapi-ts) to generate TypeScript SDKs in [client/ts](./client//ts/) which is used in our demo app.

Run an initial install to set up Open API:

```bash
npm install
```

To regenerate the types, simply run:

```bash
npm run generate
```

## Demos: E-commerce Shop

### Requirements

- Node.js `v20.14.0`
- npm `v9` or `v10`

**Note:** To make sure you're running the correct version of Node.js, we recommend using a version manager, such as [nvm](https://github.com/nvm-sh/nvm#intro). The [.nvmrc](/.nvmrc) file in the root directory of this repo will ensure the correct version is used once you run `nvm install`.

### Prerequisites

Before you can run this demo, you'll need to do some setup beforehand.

1. Open the [Developer Portal](https://www.canva.com/developers/integrations/connect-api), and click `Create an integration`.

2. Under `Configuration` → `Configure your integration`.

- `Integration name`: Add a name.
- `Client ID`: Make a note of this value; you'll need it in a later step.
- `Generate secret`: Click this and save the secret in a secure location, as you'll need it for a later step.

3. Under `Scopes` → `Set the scopes`, check the following boxes:

- `asset`: Read and Write.
- `brandtemplate:content`: Read.
- `brandtemplate:meta`: Read.
- `design:content`: Read and Write.
- `design:meta`: Read.
- `profile`: Read.

4. Under `Authentication` → `Add Authentication`, locate `URL 1` and enter the following value:

```
http://127.0.0.1:3001/oauth/redirect
```

### How to run

1. Install dependencies

```bash
cd demos/ecommerce_shop
npm install
```

2. Add your integration settings to the `demos/ecommerce_shop/.env` file.

- `CANVA_CLIENT_ID`: This is the `Client ID` from the prerequisites.
- `CANVA_CLIENT_SECRET`: This is the `client secret` you generated in the prerequisites.
- `DATABASE_ENCRYPTION_KEY`: This will be used to encrypt and decrypt the tokens stored in the JSON database. You can generate one with `generate:db-key`.

3. Run the app

```bash
npm start
```

> [!WARNING]  
> Accessing the app via `localhost:3000` will throw CORS errors, you must access the app via the below URL.

4. View your app: [http://127.0.0.1:3000](http://127.0.0.1:3000)

### Decision Registry

#### Multer

We use [Multer](https://www.npmjs.com/package/multer) in our Express.js app to handle file uploads. It simplifies the process of uploading files and reduces the amount of code required. There are other alternatives to `Multer`, like [express-fileupload](https://www.npmjs.com/package/express-fileupload) that you can use in your own application.

## Helpful Links

[Canva Connect API - Getting Started](https://canva-connect-api.apidocumentation.com/guide/getting-started)  
[Canva Connect API - Official Documentation](https://www.canva.dev/docs/connect/)  
