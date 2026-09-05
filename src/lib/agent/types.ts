import type { UserRole, UserLocation } from "@/types/user";
import type { ActionPlan } from "@/types/action";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  quickReplies?: { label: string; payload: string }[];
  toolCalls?: {
    name: string;
    args: Record<string, unknown>;
    status: "running" | "completed" | "failed";
  }[];
  actionPlanPreview?: ActionPlan;
}

export interface ChatContext {
  location: UserLocation;
  role?: UserRole;
  scenario?: "A" | "B" | "C" | "D" | "LIVE";
  isOutdoorEvent?: boolean;
}

export interface AgentProvider {
  sendMessage(
    message: string,
    history: ChatMessage[],
    context: ChatContext
  ): Promise<ChatMessage>;
}
