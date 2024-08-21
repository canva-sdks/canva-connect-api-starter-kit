import express from "express";
import multer from "multer";
import { injectClient } from "../../../common/backend/middleware/client";
import { db } from "..";

const router = express.Router();

const endpoints = {
  DUMMY_POST: "/dummy/post",
  DUMMY_GET: "/dummy/get",
};

/**
 * Use multer to allow image uploads to your backend, and from there uploading assets to Canva.
 * TODO: remove the `_` suffix if you need to upload assets in your integration
 */
const _upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.use((req, res, next) => injectClient(req, res, next, db));

router.post(endpoints.DUMMY_POST, async (req, res) => {
  return res.json({
    hello: "world",
  });
});

router.get(endpoints.DUMMY_GET, async (req, res) => {
  return res.json({
    hello: "world",
  });
});

export default router;
