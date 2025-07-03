import express from "express";
import { BrandTemplateService } from "@canva/connect-api-ts";

console.log("[Brand Templates] Route module initialized");

const endpoints = {
  BRAND_TEMPLATES: "/api/brand-templates",
  BRAND_TEMPLATE_DATASET: "/api/brand-templates/:id/dataset",
};

const router = express.Router();

// Debug route to catch all requests to this router
router.use((req, res, next) => {
  console.log("[Brand Templates Debug] Request received:", {
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    method: req.method,
  });
  next();
});

router.get(endpoints.BRAND_TEMPLATES, async (req, res) => {
  try {
    const result = await BrandTemplateService.listBrandTemplates({
      client: req.client,
    });

    if (result.error) {
      return res.status(result.response.status).json(result.error);
    }

    if (!result.data) {
      return res.status(500).json({ error: "No data received from Canva API" });
    }

    return res.json({
      items: result.data.items || [],
      continuation: result.data.continuation,
    });
  } catch (error) {
    console.error("Unexpected error fetching brand templates:", error);
    return res.status(500).json({ error: "Failed to fetch brand templates" });
  }
});

router.get(endpoints.BRAND_TEMPLATE_DATASET, async (req, res) => {
  try {
    const result = await BrandTemplateService.getBrandTemplateDataset({
      client: req.client,
      path: {
        brandTemplateId: req.params.id,
      },
    });

    if (result.error) {
      return res.status(result.response.status).json(result.error);
    }

    if (!result.data) {
      return res.status(500).json({ error: "No data received from Canva API" });
    }

    return res.json(result.data);
  } catch (error) {
    console.error("Unexpected error fetching brand template dataset:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch brand template dataset" });
  }
});

export default router;
