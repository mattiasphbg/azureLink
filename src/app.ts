import express from "express";
import type { Request, Response } from "express";

const app = express();
const port: number = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Example app listening at http://localhost:${port}`);
});
