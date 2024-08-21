import express from "express";
import { DesignService } from "@canva/connect-api-ts/ts/services.gen";
import type { CreateDesignRequest } from "@canva/connect-api-ts";

const router = express.Router();

const endpoints = {
  DESIGNS: "/designs",
  GET_DESIGN: "/design/:id",
};

router.post(endpoints.DESIGNS, async (req, res) => {
  const requestBody: CreateDesignRequest = req.body;
  const result = await DesignService.createDesign({
    client: req.client,
    body: requestBody,
  });
  if (result.error) {
    console.log(result.error);
    return res.status(result.response.status).json(result.error);
  }

  return res.json(result.data);
});

router.get(endpoints.GET_DESIGN, async (req, res) => {
  const result = await DesignService.getDesign({
    client: req.client,
    path: { designId: req.params.id },
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

export default router;
