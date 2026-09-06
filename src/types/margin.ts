export interface MarginInput {
  purchase_price: number;
  transport_cost?: number;
  waste_pct?: number;
  selling_price: number;
}

export type MarginStatus = "healthy" | "warning" | "critical";

export interface MarginResult {
  purchase_price: number;
  transport_cost: number;
  waste_pct: number;
  selling_price: number;
  effective_cost: number;
  gross_profit: number;
  gross_margin_pct: number;
  markup_pct: number;
  status: MarginStatus;
}
