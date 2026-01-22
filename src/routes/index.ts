import { Router } from "express";
import healthRoute from "./health.js";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "../graphql/schema.js";
import rootValue from "../graphql/root-value.js";
import { postRootValue, postSchema } from "../modules/post/index.js";
import {
  modularSchema,
  modularRootValue,
} from "../graphql/aggregating-modular-schema.js";

function createRoutes(): Router {
  const routes = Router();
  routes.use(healthRoute);
  routes.all("/graphql", createHandler({ schema, rootValue }));
  routes.all(
    "/post-gql",
    createHandler({ schema: postSchema, rootValue: postRootValue }),
  );
  routes.all(
    "/modular-gql",
    createHandler({ schema: modularSchema, rootValue: modularRootValue }),
  );
  return routes;
}

export default createRoutes;
