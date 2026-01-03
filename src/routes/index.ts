import { Router } from "express";
import healthRoute from "./health.js";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "../graphql/schema.js";

function createRoutes(): Router {
  const routes = Router();
  routes.use(healthRoute);
  routes.all("/graphql", createHandler({ schema }));

  return routes;
}

export default createRoutes;
