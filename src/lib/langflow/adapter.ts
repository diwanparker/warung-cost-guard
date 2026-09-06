import { langflowClient } from "./client";
import { getEnv } from "@/lib/env";
import {
  executeGetMarketPrices,
  executeCalculateMargin,
  executeSuggestPriceAction,
  executeNotifySupplier,
} from "@/lib/mcp/tools";
import type {
  McpGetMarketPricesInput,
  McpCalculateMarginInput,
  McpSuggestPriceActionInput,
  McpNotifySupplierInput,
} from "@/types/mcp";

export class HybridLangflowAdapter {
  async getMarketPrices(params: McpGetMarketPricesInput) {
    const env = getEnv();
    if (env.LANGFLOW_FLOW_ID_MARKET_PRICES) {
      const remote = await langflowClient.runFlow(env.LANGFLOW_FLOW_ID_MARKET_PRICES, params as unknown as Record<string, unknown>);
      if (remote.result && !remote.error) {
        return remote.result;
      }
    }
    return executeGetMarketPrices(params);
  }

  async calculateMargin(params: McpCalculateMarginInput) {
    const env = getEnv();
    if (env.LANGFLOW_FLOW_ID_MARGIN) {
      const remote = await langflowClient.runFlow(env.LANGFLOW_FLOW_ID_MARGIN, params as unknown as Record<string, unknown>);
      if (remote.result && !remote.error) {
        return remote.result;
      }
    }
    return executeCalculateMargin(params);
  }

  async suggestPriceAction(params: McpSuggestPriceActionInput) {
    const env = getEnv();
    if (env.LANGFLOW_FLOW_ID_ACTION) {
      const remote = await langflowClient.runFlow(env.LANGFLOW_FLOW_ID_ACTION, params as unknown as Record<string, unknown>);
      if (remote.result && !remote.error) {
        return remote.result;
      }
    }
    return executeSuggestPriceAction(params);
  }

  async notifySupplier(params: McpNotifySupplierInput) {
    return executeNotifySupplier(params);
  }
}

export const workflowAdapter = new HybridLangflowAdapter();
