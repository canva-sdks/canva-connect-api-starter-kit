import type { CreateDesignExportJobRequest } from "@canva/connect-api-ts";
import { ExportService } from "@canva/connect-api-ts";
import express from "express";
import fs from "fs";
import https from "https";
import type { DownloadExportedDesignRequest } from "@realty-demo/shared-models";

const router = express.Router();

const BACKEND_URL = process.env.BACKEND_URL;

const endpoints = {
  CREATE_DESIGN_EXPORT_JOB: "/exports",
  GET_DESIGN_EXPORT_JOB: "/exports/:id",
  DOWNLOAD_EXPORT: "/exports/download",
};

router.post(endpoints.CREATE_DESIGN_EXPORT_JOB, async (req, res) => {
  const requestBody: CreateDesignExportJobRequest = req.body;
  const result = await ExportService.createDesignExportJob({
    client: req.client,
    body: requestBody,
  });

  if (result.error) {
    return res.status(result.response.status).json(result.error);
  }

  return res.json(result.data);
});

router.get(endpoints.GET_DESIGN_EXPORT_JOB, async (req, res) => {
  const result = await ExportService.getDesignExportJob({
    client: req.client,
    path: { exportId: req.params.id },
  });

  if (result.error) {
    return res.status(result.response.status).json(result.error);
  }

  if (!result.data) {
    return res.status(404).json();
  }

  return res.json(result.data);
});

/**
 * NOTE: Exported image urls from Canva expire after some time, so you should
 * download and store the images separately. Here you would normally download
 * and write to your own permanent image storage solution, such as an S3. Here
 * we write to the local file system for demo purposes.
 */
router.post(endpoints.DOWNLOAD_EXPORT, async (req, res) => {
  const requestBody: DownloadExportedDesignRequest = req.body;

  // Download all exported design URLs
  const downloadPromises = requestBody.exportedDesignUrls.map(
    (exportedDesignUrl) => {
      return new Promise<string>((resolve, reject) => {
        // Build the download filename similar to: "3333-838106404244599455.png"
        const exportPathName = new URL(exportedDesignUrl).pathname; // e.g. aaa/bbb/1/2/3333-838106404244599455.png
        const fileName = exportPathName.split("/").slice(-1);

        // __dirname = "...demos/realty/backend/routes" -> replace "/routes"
        // with "public/exports" -> "...demos/realty/backend/public/exports"
        const destinationPath = __dirname.replace("/routes", "/public/exports");

        const destinationFile = `${destinationPath}/${fileName}`;
        const designExportUrl = `${BACKEND_URL}/public/exports/${fileName}`;
        if (!fs.existsSync(destinationPath)) {
          fs.mkdirSync(destinationPath);
        }

        // Open the destination file, download and stream the exportedDesignUrl to the file
        const file = fs.createWriteStream(destinationFile);
        const request = https.get(exportedDesignUrl, (response) => {
          if (response.statusCode !== 200) {
            fs.unlink(destinationFile, () => {
              console.error("File not found:", exportedDesignUrl);
            });
            reject(new Error(`Failed to download: ${exportedDesignUrl}`));
            return;
          }
          response.pipe(file);
        });

        file.on("finish", () => {
          resolve(designExportUrl);
        });

        request.on("error", (err) => {
          fs.unlink(destinationFile, () => {
            console.error("Error downloading file:", err);
          });
          reject(err);
        });

        file.on("error", (err) => {
          fs.unlink(destinationFile, () => {
            console.error("Error downloading file:", err);
          });
          reject(err);
        });

        request.end();
      });
    },
  );

  try {
    const downloadedExportUrls = await Promise.all(downloadPromises);

    return res.json({
      downloadedExportUrls,
    });
  } catch (error) {
    console.error("Error downloading files:", error);
    return res.status(500).json({ error: "Failed to download files" });
  }
});

export default router;
