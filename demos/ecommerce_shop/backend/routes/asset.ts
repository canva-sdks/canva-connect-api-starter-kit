import express from "express";
import multer from "multer";
import { AssetService } from "@canva/connect-api-ts";
import { injectClient } from "../../../common/backend/middleware/client";
import { createClient } from "@hey-api/client-fetch";
import { db } from "../database/database";

const router = express.Router();

router.use((req, res, next) => injectClient(req, res, next, db));

const endpoints = {
  CREATE_ASSET_UPLOAD_JOB: "/asset-uploads",
  GET_ASSET_UPLOAD_JOB: "/asset-uploads/:jobId",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  endpoints.CREATE_ASSET_UPLOAD_JOB,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      console.warn("No image uploaded.", req.body);
      return res.status(400).send("No image uploaded.");
    }

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    const clientConfig = req.client.getConfig();
    const baseHeaders = clientConfig.headers as Headers;
    const authorizationHeader = baseHeaders.get("authorization");

    if (!authorizationHeader) {
      return res.status(401).send("No authorization header found.");
    }

    const client = createClient({
      ...clientConfig,
      headers: new Headers({
        Authorization: authorizationHeader,
        "Content-Type": "application/octet-stream",
      }),
    });

    const result = await AssetService.createAssetUploadJob({
      client,
      headers: {
        "Asset-Upload-Metadata": {
          name_base64: btoa(req.body.name),
        },
      },
      body: blob,
      // By default the body is JSON stringified, but given this endpoint accepts a binary stream
      // we need to override the default body serializer to not JSON stringify
      bodySerializer: (body: Blob) => body,
    });

    if (result.error) {
      console.log(result.error);
      return res.status(result.response.status).json(result.error);
    }

    return res.json(result.data);
  },
);

router.get(endpoints.GET_ASSET_UPLOAD_JOB, async (req, res) => {
  const result = await AssetService.getAssetUploadJob({
    client: req.client,
    path: { jobId: req.params.jobId },
  });

  if (result.error) {
    return res.status(result.response.status).json(result.error);
  }

  return res.json(result.data);
});

export default router;
