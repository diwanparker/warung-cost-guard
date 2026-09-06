import {
  getMarketPricesInputSchema,
  calculateMarginInputSchema,
  suggestPriceActionInputSchema,
  notifySupplierInputSchema,
} from "./schemas";
import { fetchMarketPrices } from "@/lib/market/client";
import { calculateMargin } from "@/lib/margin/calculator";
import { suggestPriceAction } from "@/lib/actions/recommender";
import { notificationProvider } from "@/lib/notifications/mock-provider";
import type {
  McpGetMarketPricesOutput,
  McpCalculateMarginOutput,
  McpSuggestPriceActionOutput,
  McpNotifySupplierOutput,
} from "@/types/mcp";

export async function executeGetMarketPrices(rawInput: unknown): Promise<McpGetMarketPricesOutput> {
  const input = getMarketPricesInputSchema.parse(rawInput);
  return fetchMarketPrices(input.commodity, input.city, input.date);
}

export function executeCalculateMargin(rawInput: unknown): McpCalculateMarginOutput {
  const input = calculateMarginInputSchema.parse(rawInput);
  return calculateMargin({
    purchase_price: input.purchase_price,
    transport_cost: input.transport_cost,
    waste_pct: input.waste_pct,
    selling_price: input.selling_price,
  });
}

export function executeSuggestPriceAction(rawInput: unknown): McpSuggestPriceActionOutput {
  const input = suggestPriceActionInputSchema.parse(rawInput);
  return suggestPriceAction(input);
}

export async function executeNotifySupplier(rawInput: unknown): Promise<McpNotifySupplierOutput> {
  const input = notifySupplierInputSchema.parse(rawInput);
  return notificationProvider.send(input);
}
