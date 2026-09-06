import { describe, it, expect } from "vitest";
import { calculateMargin, formatRupiah } from "@/lib/margin/calculator";

describe("Deterministic Margin Calculator", () => {
  it("should correctly compute effective cost with yield adjustment and transport cost", () => {
    // (36500 + 1500) / (1 - 0.05) = 38000 / 0.95 = 40000
    const result = calculateMargin({
      purchase_price: 36500,
      transport_cost: 1500,
      waste_pct: 5,
      selling_price: 45000,
    }, 18);

    expect(result.purchase_price).toBe(36500);
    expect(result.transport_cost).toBe(1500);
    expect(result.waste_pct).toBe(5);
    expect(result.effective_cost).toBe(40000);
    expect(result.gross_profit).toBe(5000);
    expect(result.gross_margin_pct).toBe(11.11);
    expect(result.status).toBe("warning");
  });

  it("should handle zero waste correctly", () => {
    const result = calculateMargin({
      purchase_price: 15000,
      transport_cost: 500,
      waste_pct: 0,
      selling_price: 20000,
    });

    expect(result.effective_cost).toBe(15500);
    expect(result.gross_profit).toBe(4500);
    expect(result.gross_margin_pct).toBe(22.5);
    expect(result.status).toBe("healthy");
  });

  it("should classify margin as critical when gross margin is under 8%", () => {
    const result = calculateMargin({
      purchase_price: 60000,
      transport_cost: 2000,
      waste_pct: 8,
      selling_price: 70000,
    }, 20);

    expect(result.gross_margin_pct).toBeLessThan(8);
    expect(result.status).toBe("critical");
  });

  it("should handle negative margin when selling at a loss", () => {
    const result = calculateMargin({
      purchase_price: 50000,
      transport_cost: 5000,
      waste_pct: 10,
      selling_price: 40000,
    });

    expect(result.gross_profit).toBeLessThan(0);
    expect(result.gross_margin_pct).toBeLessThan(0);
    expect(result.status).toBe("critical");
  });

  it("should correctly format Rupiah string", () => {
    const formatted = formatRupiah(45000);
    expect(formatted).toContain("45.000");
  });
});
