import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`${config.appName} is running on port ${config.port}`);
});

server.on("error", (error: Error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
