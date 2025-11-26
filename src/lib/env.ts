import { z } from "zod";

const envSchema = z.object({
  POSTGRES_URL: z.string().min(1, "POSTGRES_URL is required"),
  ADMIN_USERNAME: z.string().min(1, "ADMIN_USERNAME is required"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required"),
  ADMIN_SESSION_SECRET: z
    .string()
    .min(32, "ADMIN_SESSION_SECRET must be at least 32 characters"),
});

type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) {
    return cached;
  }

  const parsed = envSchema.safeParse({
    POSTGRES_URL: process.env.POSTGRES_URL,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.message}`
    );
  }

  cached = parsed.data;
  return cached;
}
