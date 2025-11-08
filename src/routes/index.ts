import { Router } from "express";
import { cosmosRoutes } from "./cosmosRoutes";
import { usersRoutes } from "./usersRoutes";

const router = Router();

router.use("/cosmos", cosmosRoutes);
router.use("/users", usersRoutes);

router.use("/health", (_, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "API is healthy",
  });
});
//
export default router;
