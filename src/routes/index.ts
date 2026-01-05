import { Router } from "express";
import healthRoute from "./health.js";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "../graphql/schema.js";
import rootValue from "../graphql/root-value.js";

function createRoutes(): Router {
  const routes = Router();
  routes.use(healthRoute);
  routes.all("/graphql", createHandler({ schema, rootValue }));

  return routes;
}

export default createRoutes;
