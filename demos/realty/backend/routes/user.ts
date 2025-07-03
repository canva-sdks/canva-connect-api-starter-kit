import express from "express";
import { UserService } from "@canva/connect-api-ts";

const router = express.Router();

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
