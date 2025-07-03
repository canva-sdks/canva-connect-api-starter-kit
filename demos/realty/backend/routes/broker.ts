import express from "express";
import { db } from "../database/database";

const router = express.Router();

const endpoints = {
  BROKERS: "/brokers",
  BROKER_BY_ID: "/brokers/:id",
};

router.get(endpoints.BROKERS, async (req, res) => {
  const data = await db.read();

  return res.json({ brokers: data.brokers });
});

router.get(endpoints.BROKER_BY_ID, async (req, res) => {
  const data = await db.read();
  const broker = data.brokers.find((b) => b.id === Number(req.params.id));

  if (!broker) {
    return res.status(404).json();
  }

  return res.json({ broker });
});

export default router;
