export type ActionPriority = "high" | "medium" | "low";

export interface RecommendedAction {
  id: string;
  action: string;
  reason: string;
  priority: ActionPriority;
  source: string;
  assignee?: string;
  completed: boolean;
}

export interface ActionPlan {
  summary: string;
  riskContext: string;
  priorityActions: RecommendedAction[];
  recommendedActions: RecommendedAction[];
  monitoring: RecommendedAction[];
  doNotDo: string[];
  sourceWarning: "BMKG";
  sopSources: string[];
  requiresConfirmation: boolean;
}

export interface NotificationRequest {
  confirmed: boolean;
  recipients: string[];
  message: string;
  channel: "email" | "whatsapp" | "task" | "mock";
  actionPlanId?: string;
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  recipientCount: number;
  timestamp: string;
  message: string;
}
