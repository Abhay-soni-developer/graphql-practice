import type { Server } from "node:http";

type SubscriptionServer = {
  dispose(): void | Promise<void>;
};

export default function createShutdownHandler(
  server: Server,
  subscriptionServer: SubscriptionServer,
): () => Promise<void> {
  let shuttingDown = false;

  return async function shutdown(): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log("Shutting down...");

    // Avoid waiting forever for active connections.
    const timeout = setTimeout(() => {
      console.error("Shutdown timed out");
      process.exit(1);
    }, 10_000);

    // If all other work finishes, Node can exit before the timer fires.
    timeout.unref();

    try {
      // Stop accepting HTTP connections.
      const httpClosed = new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      // Observe both cleanup operations, even if one fails.
      await Promise.all([httpClosed, subscriptionServer.dispose()]);

      clearTimeout(timeout);
      console.log("Server stopped");
    } catch (error: unknown) {
      clearTimeout(timeout);
      console.error("Shutdown failed:", error);
      process.exitCode = 1;
    }
  };
}
