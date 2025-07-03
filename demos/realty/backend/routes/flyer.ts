import express from "express";
import { db } from "../database/database";
import { v4 as uuidv4 } from "uuid";
import type { FlyerDesign } from "@realty-demo/shared-models";

const router = express.Router();

// Get all flyers
router.get("/flyers", async (req, res) => {
  try {
    const data = await db.read();
    // Initialize flyers array if it doesn't exist
    if (!data.flyers) {
      data.flyers = [];
      await db.write({ ...data, flyers: [] });
    }
    return res.json({ flyers: data.flyers });
  } catch (error) {
    console.error("Error getting flyers:", error);
    return res.status(500).json({ error: "Failed to get flyers" });
  }
});

// Create a new flyer
router.post("/flyers", async (req, res) => {
  try {
    const newFlyer: FlyerDesign = {
      id: uuidv4(),
      ...req.body,
    };

    const data = await db.read();

    // Initialize flyers array if it doesn't exist
    if (!data.flyers) {
      data.flyers = [];
    }

    const updatedFlyers = [...data.flyers, newFlyer];
    await db.write({ ...data, flyers: updatedFlyers });

    return res.status(201).json({ flyer: newFlyer });
  } catch (error) {
    console.error("Error creating flyer:", error);
    return res.status(500).json({ error: "Failed to create flyer" });
  }
});

router.put("/flyers/:id", async (req, res) => {
  const { id } = req.params;
  const { updatedFlyer } = req.body as {
    updatedFlyer: Partial<FlyerDesign>;
  };
  const data = await db.read();

  const updatedFlyers = data.flyers.map((f) =>
    f.id === id ? { ...f, ...updatedFlyer } : f,
  );

  await db.write({ ...data, flyers: updatedFlyers });
  return res.json({ updatedFlyer });
});

export default router;
