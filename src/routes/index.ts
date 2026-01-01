import { Router } from "express";
import healthRoute from "./health.js";

function createRoutes(): Router {
  const routes = Router();
  routes.use(healthRoute);

  return routes;
}

export default createRoutes;
