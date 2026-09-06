import { DEMO_MARKET_PRICES } from "@/data/demo/market-prices";
import { getCommodityById, MASTER_COMMODITIES } from "@/data/commodities";
import { normalizeCommodity } from "./normalizer";
import { getCachedMarketPrice, setCachedMarketPrice } from "./cache";
import { getEnv } from "@/lib/env";
import type { MarketPriceResult } from "@/types/market";

export async function fetchMarketPrices(
  rawCommodity: string,
  city: string = "Surabaya",
  date?: string
): Promise<MarketPriceResult> {
  const normalizedId = normalizeCommodity(rawCommodity);
  const cacheKey = `${normalizedId}:${city.toLowerCase()}:${date || "latest"}`;

  const cached = getCachedMarketPrice(cacheKey);
  if (cached) {
    return cached;
  }

  const env = getEnv();

  // If in DEMO_MODE or live is not configured, use curated demo snapshot
  if (env.DEMO_MODE || !env.PIHPS_BASE_URL) {
    const demo = DEMO_MARKET_PRICES[normalizedId];
    if (demo) {
      const result: MarketPriceResult = {
        ...demo,
        city,
        source_time: date || demo.source_time,
        is_demo: true,
      };
      setCachedMarketPrice(cacheKey, result);
      return result;
    }

    // Fallback if not in demo set: create from master commodity info
    const master = getCommodityById(normalizedId) || MASTER_COMMODITIES[0];
    const defaultMedian = master.defaultSellingPrice;
    const syntheticResult: MarketPriceResult = {
      commodity: master.id,
      commodity_name: master.name,
      city,
      prices: [
        { source: "PIHPS", value: defaultMedian, marketName: "Pasar Keputran", sourceTime: "2026-09-06" },
        { source: "Bapanas", value: defaultMedian - 500, marketName: "Pasar Wonokromo", sourceTime: "2026-09-06" },
      ],
      median_reference: defaultMedian,
      min_price: defaultMedian - 500,
      max_price: defaultMedian,
      unit: master.unit,
      source_time: "2026-09-06",
      is_demo: true,
    };
    setCachedMarketPrice(cacheKey, syntheticResult);
    return syntheticResult;
  }

  // Live connector implementation (future-ready)
  try {
    const res = await fetch(`${env.PIHPS_BASE_URL}/api/prices?commodity=${normalizedId}&city=${city}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`PIHPS response status: ${res.status}`);
    const data = await res.json();
    setCachedMarketPrice(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Live market fetch failed, falling back to cached/demo snapshot:", error);
    const fallback = DEMO_MARKET_PRICES[normalizedId] || DEMO_MARKET_PRICES["ayam_ras"];
    return {
      ...fallback,
      city,
      is_demo: true,
    };
  }
}
