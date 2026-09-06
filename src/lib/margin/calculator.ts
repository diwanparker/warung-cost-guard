import type { MarginInput, MarginResult, MarginStatus } from "@/types/margin";

/**
 * Calculates deterministic margin, effective cost, and profit for small retail / F&B.
 * 
 * Effective Cost Formula:
 * Standard yield-adjusted cost accounting:
 * effective_cost = (purchase_price + transport_cost) / (1 - (waste_pct / 100))
 * 
 * When waste_pct == 0:
 * effective_cost = purchase_price + transport_cost
 */
export function calculateMargin(
  input: MarginInput,
  targetMarginPct: number = 15
): MarginResult {
  const purchasePrice = Math.max(0, Number(input.purchase_price) || 0);
  const transportCost = Math.max(0, Number(input.transport_cost) || 0);
  const wastePct = Math.min(Math.max(0, Number(input.waste_pct) || 0), 95);
  const sellingPrice = Math.max(0, Number(input.selling_price) || 0);

  const baseCost = purchasePrice + transportCost;
  
  // Yield-adjusted cost: if 5% is lost to shrinkage, 1 unit of product requires 1 / 0.95 units of raw goods
  const effectiveCost =
    wastePct > 0
      ? Math.round(baseCost / (1 - wastePct / 100))
      : baseCost;

  const grossProfit = sellingPrice - effectiveCost;

  const grossMarginPct =
    sellingPrice > 0
      ? Number(((grossProfit / sellingPrice) * 100).toFixed(2))
      : 0;

  const markupPct =
    effectiveCost > 0
      ? Number(((grossProfit / effectiveCost) * 100).toFixed(2))
      : 0;

  let status: MarginStatus = "healthy";
  if (grossMarginPct < 8) {
    status = "critical";
  } else if (grossMarginPct < targetMarginPct) {
    status = "warning";
  }

  return {
    purchase_price: purchasePrice,
    transport_cost: transportCost,
    waste_pct: wastePct,
    selling_price: sellingPrice,
    effective_cost: effectiveCost,
    gross_profit: grossProfit,
    gross_margin_pct: grossMarginPct,
    markup_pct: markupPct,
    status,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
