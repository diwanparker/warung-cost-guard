import { z } from "zod";

const envSchema = z.object({
  OPENAI_BASE_URL: z.string().url().default("https://9router.diwanparker.tech/v1"),
  OPENAI_API_KEY: z.string().optional().default("sk-a59a43ae56dc9a3f-u8fnth-d1f43a5d"),
  OPENAI_MODEL: z.string().default("Free"),
  BOB_API_KEY: z.string().optional(),
  BPS_API_KEY: z.string().optional(),
  BPS_BASE_URL: z.string().url().default("https://webapi.bps.go.id/v1/api"),
  PIHPS_BASE_URL: z.string().url().optional(),
  BAPANAS_BASE_URL: z.string().url().optional(),
  SP2KP_BASE_URL: z.string().url().optional(),
  LANGFLOW_BASE_URL: z.string().url().default("http://localhost:7860"),
  LANGFLOW_API_KEY: z.string().optional(),
  LANGFLOW_FLOW_ID_MARKET_PRICES: z.string().optional(),
  LANGFLOW_FLOW_ID_MARGIN: z.string().optional(),
  LANGFLOW_FLOW_ID_ACTION: z.string().optional(),
  DEMO_MODE: z
    .string()
    .optional()
    .transform((val) => val === undefined || val === "" || val === "true"),
  DEFAULT_CITY: z.string().default("Surabaya"),
  NOTIFICATION_PROVIDER: z.enum(["mock", "whatsapp", "email"]).default("mock"),
  CACHE_TTL_SECONDS: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 300)),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | null = null;

export function getEnv(): Env {
  if (parsedEnv) return parsedEnv;

  const result = envSchema.safeParse({
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    BOB_API_KEY: process.env.BOB_API_KEY,
    BPS_API_KEY: process.env.BPS_API_KEY,
    BPS_BASE_URL: process.env.BPS_BASE_URL,
    PIHPS_BASE_URL: process.env.PIHPS_BASE_URL,
    BAPANAS_BASE_URL: process.env.BAPANAS_BASE_URL,
    SP2KP_BASE_URL: process.env.SP2KP_BASE_URL,
    LANGFLOW_BASE_URL: process.env.LANGFLOW_BASE_URL,
    LANGFLOW_API_KEY: process.env.LANGFLOW_API_KEY,
    LANGFLOW_FLOW_ID_MARKET_PRICES: process.env.LANGFLOW_FLOW_ID_MARKET_PRICES,
    LANGFLOW_FLOW_ID_MARGIN: process.env.LANGFLOW_FLOW_ID_MARGIN,
    LANGFLOW_FLOW_ID_ACTION: process.env.LANGFLOW_FLOW_ID_ACTION,
    DEMO_MODE: process.env.DEMO_MODE,
    DEFAULT_CITY: process.env.DEFAULT_CITY,
    NOTIFICATION_PROVIDER: process.env.NOTIFICATION_PROVIDER,
    CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS,
  });

  if (!result.success) {
    console.error("Environment validation error:", result.error.format());
    throw new Error("Invalid environment configuration");
  }

  parsedEnv = result.data;
  return parsedEnv;
}
