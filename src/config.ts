import dotenv from "dotenv";
import { z } from "zod";

const nodeEnv = z
  .enum(["development", "test", "production"])
  .default("development")
  .parse(process.env.NODE_ENV);

// Existing environment variables take precedence over the file's values.
dotenv.config({ path: `.env.${nodeEnv}` });

const environmentSchema = z.object({
  APP_NAME: z.string().trim().min(1).default("graphql-practice"),
  APP_ENV: z.string().trim().min(1).default(nodeEnv),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
  // Report setting names and validation messages without exposing values.
  const details = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${details}`);
}

export const config = Object.freeze({
  nodeEnv,
  appName: result.data.APP_NAME,
  appEnv: result.data.APP_ENV,
  port: result.data.PORT,
});

export type AppConfig = typeof config;
