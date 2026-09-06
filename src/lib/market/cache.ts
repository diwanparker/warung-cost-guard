import type { MarketPriceResult } from "@/types/market";

interface CacheEntry {
  data: MarketPriceResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedMarketPrice(key: string, ttlSeconds: number = 300): MarketPriceResult | null {
  const entry = cache.get(key);
  if (!entry) return null;
  const now = Date.now();
  if (now - entry.timestamp > ttlSeconds * 1000) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedMarketPrice(key: string, data: MarketPriceResult): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearMarketPriceCache(): void {
  cache.clear();
}
