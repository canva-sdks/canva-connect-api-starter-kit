import express from "express";
import { AssetService } from "@canva/connect-api-ts";
import { createClient } from "@hey-api/client-fetch";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const endpoints = {
  CREATE_ASSET_UPLOAD_JOB: "/asset-uploads",
  GET_ASSET_UPLOAD_JOB: "/asset-uploads/:jobId",
};

router.post(
  endpoints.CREATE_ASSET_UPLOAD_JOB,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      console.warn("No image uploaded.", req.body);
      return res.status(400).send("No image uploaded.");
    }

    try {
      const blob = new Blob([req.file.buffer], {
        type: "application/octet-stream",
      });

      // Get the base client config
      const clientConfig = req.client.getConfig();
      const baseHeaders = clientConfig.headers as Headers;
      const authorizationHeader = baseHeaders.get("authorization");

      if (!authorizationHeader) {
        return res.status(401).send("No authorization header found.");
      }

      // Create a new client with the correct headers
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
            name_base64: btoa(req.body.name || "untitled"),
          },
        },
        body: blob,
        bodySerializer: (body: Blob) => body,
      });

      if (result.error) {
        console.error("Asset upload error:", result.error);
        return res.status(result.response.status).json(result.error);
      }

      return res.json(result.data);
    } catch (error) {
      console.error("Unexpected error during asset upload:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during asset upload" });
    }
  },
);

// GET route for polling upload job status
router.get(endpoints.GET_ASSET_UPLOAD_JOB, async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await AssetService.getAssetUploadJob({
      client: req.client,
      path: { jobId },
    });

    if (result.error) {
      return res.status(result.response.status).json(result.error);
    }

    return res.json(result.data);
  } catch (error) {
    console.error("Unexpected error getting asset upload job:", error);
    return res
      .status(500)
      .json({ error: "Internal server error getting asset upload job" });
  }
});

export default router;
