import { describe, it, expect } from "vitest";
import { suggestPriceAction } from "@/lib/actions/recommender";

describe("Price Action Recommender", () => {
  it("should recommend REVIEW_COST when margin is critical (<8%)", () => {
    const result = suggestPriceAction({
      commodity: "cabai_rawit_merah",
      current_margin_pct: 4.8,
      target_margin_pct: 20,
      market_reference: 62000,
      selling_price: 70000,
      role: "pedagang_pasar",
    });

    expect(result.action).toBe("REVIEW_COST");
    expect(result.options.length).toBeLessThanOrEqual(3);
    expect(result.requires_confirmation).toBe(true);
    expect(result.suggested_supplier_msg).toBeDefined();
  });

  it("should detect HET regulatory compliance for Minyakita", () => {
    const result = suggestPriceAction({
      commodity: "minyak_goreng_curah",
      current_margin_pct: 5,
      target_margin_pct: 10,
      market_reference: 15700,
      selling_price: 15700,
      role: "warung_kelontong",
    });

    expect(result.het_warning).toBeDefined();
    expect(result.het_warning).toContain("15.700");
    expect(result.action).toBe("REVIEW_COST");
  });

  it("should warn if selling price exceeds HET", () => {
    const result = suggestPriceAction({
      commodity: "minyak_goreng_curah",
      current_margin_pct: 12,
      target_margin_pct: 10,
      market_reference: 15700,
      selling_price: 16500, // Exceeds HET 15.700
      role: "warung_kelontong",
    });

    expect(result.het_warning).toContain("melebihi HET resmi");
  });

  it("should recommend REVIEW_PRICE if selling price is well below market", () => {
    const result = suggestPriceAction({
      commodity: "ayam_ras",
      current_margin_pct: 10,
      target_margin_pct: 18,
      market_reference: 45000,
      selling_price: 38000, // Significantly below market 45000
      role: "warteg",
    });

    expect(result.action).toBe("REVIEW_PRICE");
    expect(result.options[0]).toContain("Naikkan harga jual bertahap");
  });

  it("should recommend HOLD if margin is healthy and above target", () => {
    const result = suggestPriceAction({
      commodity: "beras_premium",
      current_margin_pct: 22,
      target_margin_pct: 15,
      market_reference: 16000,
      selling_price: 16500,
      role: "warung_kelontong",
    });

    expect(result.action).toBe("HOLD");
    expect(result.options[0]).toContain("Pertahankan");
  });
});
