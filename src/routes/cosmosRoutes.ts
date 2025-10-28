import { Router, Request, Response } from "express";
import { createContainer, createItem } from "../services/cosmosService";

const router = Router();

router.post("/containers", async (req: Request, res: Response) => {
  try {
    const { containerName } = req.body;
    if (!containerName) {
      return res.status(400).json({ error: "Container name is required" });
    }
    const container = await createContainer(containerName);
    res.json({
      success: true,
      containerId: container.id,
      message: "Container created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create container" });
  }
});

router.post("/items", async (req: Request, res: Response) => {
  try {
    const { containerName, item } = req.body;
    if (!containerName || !item) {
      return res
        .status(400)
        .json({ error: "Container name and item are required" });
    }
    const createdItem = await createItem(containerName, item);
    res.json({
      success: true,
      item: createdItem,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

export const cosmosRoutes = router;
