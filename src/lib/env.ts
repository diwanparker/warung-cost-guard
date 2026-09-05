import { z } from "zod";

const envSchema = z.object({
  BMKG_CAP_FEED_URL: z
    .string()
    .url()
    .default("https://signature.bmkg.go.id/alert"),
  LANGFLOW_BASE_URL: z.string().url().optional(),
  LANGFLOW_API_KEY: z.string().optional(),
  LANGFLOW_FLOW_ID_WARNING: z.string().optional(),
  LANGFLOW_FLOW_ID_ACTION_PLAN: z.string().optional(),
  DEMO_MODE: z
    .string()
    .optional()
    .transform((val) => val === undefined || val === "" || val === "true"),
  NOTIFICATION_PROVIDER: z
    .enum(["mock", "email", "webhook"])
    .default("mock"),
  BMKG_CACHE_TTL_SECONDS: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 300)),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | null = null;

export function getEnv(): Env {
  if (parsedEnv) return parsedEnv;

  const result = envSchema.safeParse({
    BMKG_CAP_FEED_URL: process.env.BMKG_CAP_FEED_URL,
    LANGFLOW_BASE_URL: process.env.LANGFLOW_BASE_URL,
    LANGFLOW_API_KEY: process.env.LANGFLOW_API_KEY,
    LANGFLOW_FLOW_ID_WARNING: process.env.LANGFLOW_FLOW_ID_WARNING,
    LANGFLOW_FLOW_ID_ACTION_PLAN: process.env.LANGFLOW_FLOW_ID_ACTION_PLAN,
    DEMO_MODE: process.env.DEMO_MODE,
    NOTIFICATION_PROVIDER: process.env.NOTIFICATION_PROVIDER,
    BMKG_CACHE_TTL_SECONDS: process.env.BMKG_CACHE_TTL_SECONDS,
  });

  if (!result.success) {
    console.error("Environment validation error:", result.error.format());
    throw new Error("Invalid environment configuration");
  }

  parsedEnv = result.data;
  return parsedEnv;
}
