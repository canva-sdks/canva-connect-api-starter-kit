import express from "express";
import { injectClient } from "../../../common/backend/middleware/client";
import { db } from "../database/database";

const router = express.Router();

router.use((req, res, next) => injectClient(req, res, next, db));
const endpoints = {
  TOKEN: "/token",
};

router.get(endpoints.TOKEN, async (req, res) => {
  // Only our FE may ask for the user's token
  if (req.headers.origin !== process.env.FRONTEND_URL) {
    return res.status(401).send("Unauthorized");
  }
  return res.status(200).send(req.token);
});

export default router;
