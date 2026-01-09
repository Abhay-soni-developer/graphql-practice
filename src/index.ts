import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { createApp } from "./app.js";
import { config } from "./config.js";
import rootValue from "./graphql/root-value.js";
import schema from "./graphql/schema.js";

const app = createApp();
const server = createServer(app);

const wsServer = new WebSocketServer({
  server,
  path: "/graphql",
});

const subscriptionServer = useServer(
  {
    schema,
    roots: {
      query: rootValue,
      mutation: rootValue,
      subscription: rootValue,
    },
  },
  wsServer,
);

server.listen(config.port, () => {
  console.log(`${config.appName} is running on port ${config.port}`);
});

server.on("error", (error: Error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
