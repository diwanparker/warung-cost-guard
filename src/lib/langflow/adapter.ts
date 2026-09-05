import { langflowClient } from "./client";
import { getEnv } from "@/lib/env";
import {
  executeGetActiveWarning,
  executeBuildRoleActionPlan,
  executeNotifyConfirmedTeam,
} from "@/lib/mcp/tools";

export interface WorkflowAdapter {
  getActiveWarning(params: {
    province: string;
    city: string;
    district: string;
  }): Promise<Record<string, unknown>>;

  buildRoleActionPlan(params: {
    warning: unknown;
    role: string;
    context?: Record<string, unknown>;
  }): Promise<Record<string, unknown>>;

  notifyConfirmedTeam(params: {
    confirmed: boolean;
    recipients: string[];
    message: string;
    channel: string;
  }): Promise<Record<string, unknown>>;
}

export class HybridLangflowAdapter implements WorkflowAdapter {
  async getActiveWarning(params: {
    province: string;
    city: string;
    district: string;
  }) {
    const env = getEnv();
    if (env.LANGFLOW_FLOW_ID_WARNING) {
      const remote = await langflowClient.runFlow(
        env.LANGFLOW_FLOW_ID_WARNING,
        params
      );
      if (remote.result && !remote.error) {
        return remote.result;
      }
    }
    // Deterministic local execution
    return executeGetActiveWarning(params);
  }

  async buildRoleActionPlan(params: {
    warning: unknown;
    role: string;
    context?: Record<string, unknown>;
  }) {
    const env = getEnv();
    if (env.LANGFLOW_FLOW_ID_ACTION_PLAN) {
      const remote = await langflowClient.runFlow(
        env.LANGFLOW_FLOW_ID_ACTION_PLAN,
        params
      );
      if (remote.result && !remote.error) {
        return remote.result;
      }
    }
    return executeBuildRoleActionPlan(params);
  }

  async notifyConfirmedTeam(params: {
    confirmed: boolean;
    recipients: string[];
    message: string;
    channel: string;
  }) {
    return executeNotifyConfirmedTeam(params);
  }
}

export const workflowAdapter = new HybridLangflowAdapter();
