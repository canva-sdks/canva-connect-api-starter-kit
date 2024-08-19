import express from "express";
import { UserService } from "@canva/connect-api-ts/ts/index";
import { injectClient } from "../../../common/backend/middleware/client";
import { db } from "..";

const router = express.Router();

router.use((req, res, next) => injectClient(req, res, next, db));

router.get("/user", async (req, res) => {
  const result = await UserService.getUserProfile({
    client: req.client,
  });
  if (result.error) {
    return res.status(result.response.status).json(result.error);
  }
  return res.json(result.data);
});

export default router;
