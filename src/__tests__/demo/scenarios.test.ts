import { describe, it, expect } from "vitest";
import { DEMO_SCENARIOS } from "@/data/demo/scenarios";
import { calculateMargin } from "@/lib/margin/calculator";
import { suggestPriceAction } from "@/lib/actions/recommender";
import { DEMO_MARKET_PRICES } from "@/data/demo/market-prices";

describe("Evaluation Demo Scenarios", () => {
  it("Scenario A: Supplier naik -> margin ayam warteg tertekan", () => {
    const sc = DEMO_SCENARIOS.A;
    const margin = calculateMargin({
      purchase_price: sc.purchasePrice,
      transport_cost: sc.transportCost,
      waste_pct: sc.wastePct,
      selling_price: sc.sellingPrice,
    }, sc.targetMarginPct);

    expect(margin.gross_margin_pct).toBeLessThan(sc.targetMarginPct);
    expect(margin.status).toBe("warning");

    const action = suggestPriceAction({
      commodity: sc.commodityId,
      current_margin_pct: margin.gross_margin_pct,
      target_margin_pct: sc.targetMarginPct,
      market_reference: DEMO_MARKET_PRICES[sc.commodityId].median_reference,
      selling_price: sc.sellingPrice,
      role: sc.role,
    });

    expect(action.action).toBe("OPTIMIZE");
    expect(action.options.length).toBeLessThanOrEqual(3);
    expect(action.requires_confirmation).toBe(true);
  });

  it("Scenario B: Harga pasar stabil & HET Minyakita", () => {
    const sc = DEMO_SCENARIOS.B;
    const margin = calculateMargin({
      purchase_price: sc.purchasePrice,
      transport_cost: sc.transportCost,
      waste_pct: sc.wastePct,
      selling_price: sc.sellingPrice,
    }, sc.targetMarginPct);

    const action = suggestPriceAction({
      commodity: sc.commodityId,
      current_margin_pct: margin.gross_margin_pct,
      target_margin_pct: sc.targetMarginPct,
      market_reference: DEMO_MARKET_PRICES[sc.commodityId].median_reference,
      selling_price: sc.sellingPrice,
      role: sc.role,
    });

    expect(action.het_warning).toBeDefined();
    expect(action.action).toBe("REVIEW_COST");
  });

  it("Scenario C: Cabai rawit merah margin kritis & draf negosiasi", () => {
    const sc = DEMO_SCENARIOS.C;
    const margin = calculateMargin({
      purchase_price: sc.purchasePrice,
      transport_cost: sc.transportCost,
      waste_pct: sc.wastePct,
      selling_price: sc.sellingPrice,
    }, sc.targetMarginPct);

    expect(margin.status).toBe("critical");

    const action = suggestPriceAction({
      commodity: sc.commodityId,
      current_margin_pct: margin.gross_margin_pct,
      target_margin_pct: sc.targetMarginPct,
      market_reference: DEMO_MARKET_PRICES[sc.commodityId].median_reference,
      selling_price: sc.sellingPrice,
      role: sc.role,
    });

    expect(action.action).toBe("REVIEW_COST");
    expect(action.suggested_supplier_msg).toBeDefined();
  });
});
