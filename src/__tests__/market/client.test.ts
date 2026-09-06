import { describe, it, expect } from "vitest";
import { fetchMarketPrices } from "@/lib/market/client";

describe("Market Price Client", () => {
  it("should fetch demo market prices for Surabaya", async () => {
    const result = await fetchMarketPrices("ayam_ras", "Surabaya");

    expect(result.commodity).toBe("ayam_ras");
    expect(result.city).toBe("Surabaya");
    expect(result.median_reference).toBeGreaterThan(30000);
    expect(result.prices.length).toBeGreaterThanOrEqual(2);
    expect(result.is_demo).toBe(true);
  });

  it("should return correct unit and sources for cabai rawit", async () => {
    const result = await fetchMarketPrices("cabe rawit", "Surabaya");

    expect(result.commodity).toBe("cabai_rawit_merah");
    expect(result.unit).toBe("kg");
    expect(result.median_reference).toBe(62000);
  });

  it("should fallback gracefully for uncommon commodities", async () => {
    const result = await fetchMarketPrices("udang_windu", "Surabaya");

    expect(result.commodity).toBeDefined();
    expect(result.median_reference).toBeGreaterThan(0);
  });
});
