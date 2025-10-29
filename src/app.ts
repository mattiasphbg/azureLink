import express from "express";
import type { Request, Response } from "express";
import router from "./routes";

const app = express();
const port: number = parseInt(process.env.PORT || "3001", 10);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Azure Link API is running",
    version: "0.0.1",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      cosmos: "/api/cosmos",
    },
  });
});

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
