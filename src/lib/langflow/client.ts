import { getEnv } from "@/lib/env";

export interface LangflowRunResponse {
  result?: Record<string, unknown>;
  outputs?: unknown[];
  error?: string;
}

export class LangflowClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    const env = getEnv();
    this.baseUrl = env.LANGFLOW_BASE_URL || "http://localhost:7860";
    this.apiKey = env.LANGFLOW_API_KEY;
  }

  async runFlow(
    flowId: string,
    inputs: Record<string, unknown> | string
  ): Promise<LangflowRunResponse> {
    const url = `${this.baseUrl}/api/v1/run/${flowId}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const inputValue = typeof inputs === "string" ? inputs : JSON.stringify(inputs);

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          input_value: inputValue,
          input_type: "chat",
          output_type: "chat",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          error: `Langflow server responded with status ${res.status}: ${res.statusText}`,
        };
      }

      const data = await res.json();
      return { result: data };
    } catch (err) {
      return {
        error: `Gagal terhubung ke Langflow endpoint: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }
}

export const langflowClient = new LangflowClient();
