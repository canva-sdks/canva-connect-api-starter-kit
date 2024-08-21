import express from "express";
import { BrandTemplateService } from "@canva/connect-api-ts";
import { injectClient } from "../../../common/backend/middleware/client";
import { db } from "../database/database";

const endpoints = {
  BRAND_TEMPLATES: "/brand-templates",
  BRAND_TEMPLATE_DATASET: "/brand-templates/:id/dataset",
};

const router = express.Router();

router.use((req, res, next) => injectClient(req, res, next, db));

router.get(endpoints.BRAND_TEMPLATES, async (req, res) => {
  const result = await BrandTemplateService.listBrandTemplates({
    client: req.client,
  });

  if (result.error) {
    console.log(result.error);
    return res.status(result.response.status).json(result.error);
  }

  return res.json(result.data);
});

router.get(endpoints.BRAND_TEMPLATE_DATASET, async (req, res) => {
  const result = await BrandTemplateService.getBrandTemplateDataset({
    client: req.client,
    path: {
      brandTemplateId: req.params.id,
    },
  });

  if (result.error) {
    console.log(result.error);
    return res.status(result.response.status).json(result.error);
  }

  return res.json(result.data);
});

export default router;
