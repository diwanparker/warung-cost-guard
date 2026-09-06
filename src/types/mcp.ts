import type { MarketPriceResult } from "./market";
import type { MarginResult } from "./margin";
import type { PriceActionOutput } from "./action";
import type { SupplierNotificationResult } from "./supplier";
import type { BusinessRole } from "./user";

export type McpToolName =
  | "get_market_prices"
  | "calculate_margin"
  | "suggest_price_action"
  | "notify_supplier";

export interface McpGetMarketPricesInput {
  commodity: string;
  city?: string;
  date?: string;
}

export type McpGetMarketPricesOutput = MarketPriceResult;

export interface McpCalculateMarginInput {
  purchase_price: number;
  transport_cost?: number;
  waste_pct?: number;
  selling_price: number;
}

export type McpCalculateMarginOutput = MarginResult;

export interface McpSuggestPriceActionInput {
  commodity: string;
  current_margin_pct: number;
  target_margin_pct?: number;
  market_reference: number;
  selling_price: number;
  effective_cost?: number;
  role?: BusinessRole;
}

export type McpSuggestPriceActionOutput = PriceActionOutput;

export interface McpNotifySupplierInput {
  supplier_id: string;
  message: string;
  confirmed: boolean;
  commodity?: string;
  channel?: "whatsapp" | "email" | "mock";
}

export type McpNotifySupplierOutput = SupplierNotificationResult;
