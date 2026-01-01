import express from "express";
import type { Express } from "express";
import createRoutes from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(createRoutes());

  return app;
}
