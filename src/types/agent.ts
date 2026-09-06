import type { BusinessRole } from "@/types/user";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCalls?: {
    toolName: string;
    params: Record<string, unknown>;
    result?: Record<string, unknown>;
  }[];
}

export interface ChatContext {
  role?: BusinessRole;
  city?: string;
  activeCommodityId?: string;
  purchasePrice?: number;
  transportCost?: number;
  wastePct?: number;
  sellingPrice?: number;
  scenarioId?: "A" | "B" | "C";
}

export interface AgentProvider {
  sendMessage(
    message: string,
    history: ChatMessage[],
    context: ChatContext
  ): Promise<ChatMessage>;
}
