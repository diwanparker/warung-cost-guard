import type { BusinessRole } from "./user";

export type PriceActionType =
  | "HOLD"
  | "OPTIMIZE"
  | "REVIEW_COST"
  | "REVIEW_PRICE"
  | "PORTION_CONTROL"
  | "SUPPLIER_SWITCH";

export interface PriceActionInput {
  commodity: string;
  current_margin_pct: number;
  target_margin_pct: number;
  market_reference: number;
  selling_price: number;
  effective_cost?: number;
  role?: BusinessRole;
}

export interface PriceActionOutput {
  action: PriceActionType;
  headline: string;
  options: string[];
  confidence: "high" | "medium" | "low";
  requires_confirmation: boolean;
  reasoning: string;
  het_warning?: string;
  suggested_supplier_msg?: string;
}
