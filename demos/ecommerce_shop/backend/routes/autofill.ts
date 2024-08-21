import express from "express";
import { injectClient } from "../../../common/backend/middleware/client";
import { AutofillService } from "@canva/connect-api-ts";
import { db } from "../database/database";

const router = express.Router();

router.use((req, res, next) => injectClient(req, res, next, db));

const endpoints = {
  CREATE_AUTOFILL_JOB: "/autofill/create",
  GET_AUTOFILL_JOB_BY_ID: "/autofill/get/:id",
};

router.post(endpoints.CREATE_AUTOFILL_JOB, async (req, res) => {
  const result = await AutofillService.createDesignAutofillJob({
    client: req.client,
    path: {
      brandTemplateId: req.params.id,
    },
    body: req.body,
  });

  if (result.error) {
    console.log(result.error);
    return res.status(result.response.status).json(result.error);
  }

  return res.json(result.data);
});

router.get(endpoints.GET_AUTOFILL_JOB_BY_ID, async (req, res) => {
  const result = await AutofillService.getDesignAutofillJob({
    client: req.client,
    path: {
      jobId: req.params.id,
    },
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
