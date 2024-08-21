import type { CreateDesignExportJobRequest } from "@canva/connect-api-ts";
import { ExportService } from "@canva/connect-api-ts/ts/services.gen";
import express from "express";
import fs from "fs";
import https from "https";
import { db } from "../database/database";
import type { DownloadExportedDesignRequest, ProductDesign } from "../models";
import { writeProduct } from "./product";

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
    console.log(result.error);
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
    console.log(result.error);
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
  const data = await db.read();

  // First, if a productID is provided return early if no product was found or
  // if no design exists for the product.
  const product = data.products.find(
    (product) => product.id === requestBody.productId,
  );
  if (requestBody.productId) {
    if (!product) {
      return res.status(404).json();
    }

    if (!product.canvaDesign) {
      return res.status(400).json();
    }
  }

  // Second, build the download filename similar to: "3333-838106404244599455.png"
  const exportPathName = new URL(requestBody.exportedDesignUrl).pathname; // e.g. aaa/bbb/1/2/3333-838106404244599455.png
  const fileName = exportPathName.split("/").slice(-1);

  // __dirname = "...demos/ecommerce_shop/backend/routes" -> replace "/routes"
  // with "public/exports" -> "...demos/ecommerce_shop/backend/public/exports"
  const destinationPath = __dirname.replace("/routes", "/public/exports");

  const destinationFile = `${destinationPath}/${fileName}`;
  const designExportUrl = `${BACKEND_URL}/public/exports/${fileName}`;

  // Third, check if the exports folder exists, and create it if not.
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath);
  }

  // Fourth, open the destination file, download and stream the exportedDesignUrl
  // to the file.
  const file = fs.createWriteStream(destinationFile);
  const request = https.get(requestBody.exportedDesignUrl, (response) => {
    if (response.statusCode !== 200) {
      fs.unlink(destinationFile, () => {
        console.error("File not found:", requestBody.exportedDesignUrl);
      });
      return res.status(500).json(); // something went wrong
    }
    response.pipe(file);
  });

  // Lastly, depending on the status of writing to the file, if finished update
  // the db with the newProduct or return with an error if something went wrong.
  file.on("finish", async () => {
    if (requestBody.productId && product) {
      await writeProduct({
        ...product,
        canvaDesign: {
          ...(product.canvaDesign as ProductDesign),
          designExportUrl,
        },
      });
    }

    return res.json({
      downloadedExportUrl: designExportUrl,
    });
  });

  request.on("error", (err) => {
    fs.unlink(destinationFile, () => {
      console.error("Error downloading file:", err);
      return res.status(500).json(); // something went wrong
    });
  });

  file.on("error", (err) => {
    fs.unlink(destinationFile, () => {
      console.error("Error downloading file:", err);
      return res.status(500).json(); // something went wrong
    });
  });

  request.end();
});

export default router;
