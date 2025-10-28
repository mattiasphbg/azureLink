import { Router, Request, Response } from "express";
import { initializeGraphClient } from "../services/authService";

const router = Router();

router.get("/:userID", async (req: Request, res: Response) => {
  try {
    const client = await initializeGraphClient();
    const user = await client.api(`/users/${req.params.userID}`).get();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const client = await initializeGraphClient();
    const users = await client.api(`/users`).get();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

export const usersRoutes = router;
