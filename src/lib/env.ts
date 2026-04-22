import "server-only";
import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    process.stderr.write("Invalid environment variables:\n");
    process.stderr.write(`${z.prettifyError(result.error)}\n`);
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
