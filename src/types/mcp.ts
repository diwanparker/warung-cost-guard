import type { UserRole } from "./user";
import type { WarningMatchResult } from "./bmkg";
import type { ActionPlan, NotificationRequest, NotificationResult } from "./action";

export interface McpToolGetWarningInput {
  province: string;
  city: string;
  district: string;
}

export interface McpToolGetWarningOutput {
  matched: boolean;
  source: "BMKG";
  event: string | null;
  headline: string | null;
  description: string | null;
  effective: string | null;
  expires: string | null;
  area: string | null;
  matched_location: string | null;
  confidence: string;
  reason: string;
  status: string;
}

export interface McpToolBuildActionPlanInput {
  warning: WarningMatchResult;
  role: UserRole;
  context?: {
    outdoor_event?: boolean;
    participants?: number;
    notes?: string;
  };
}

export type McpToolBuildActionPlanOutput = ActionPlan;

export type McpToolNotifyInput = NotificationRequest;

export type McpToolNotifyOutput = NotificationResult;

export type McpToolName =
  | "get_active_bmkg_warning"
  | "build_role_action_plan"
  | "notify_confirmed_team";
