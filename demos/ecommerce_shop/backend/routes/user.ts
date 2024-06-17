import express from "express";
import { UserService } from "@canva/connect-api-ts/ts/index";
import { injectClient } from "../middleware/client";

const router = express.Router();

router.use(injectClient);

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
