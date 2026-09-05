import { getEnv } from "@/lib/env";
import { parseCapXml } from "./parser";
import { bmkgCache } from "./cache";
import type { BmkgWarning } from "@/types/bmkg";

const CACHE_KEY = "bmkg_active_warnings";

export async function fetchBmkgWarnings(
  feedUrl?: string,
  forceRefresh = false
): Promise<BmkgWarning[]> {
  const env = getEnv();
  const url = feedUrl || env.BMKG_CAP_FEED_URL;

  if (!forceRefresh) {
    const cached = bmkgCache.get<BmkgWarning[]>(CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/xml, text/xml, */*",
        "User-Agent": "SIAGA-BMKG-Warning-Copilot/1.0",
      },
      next: { revalidate: env.BMKG_CACHE_TTL_SECONDS },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `BMKG CAP feed responded with HTTP status ${response.status}: ${response.statusText}`
      );
      return [];
    }

    const xmlText = await response.text();

    let warnings: BmkgWarning[] = [];
    if (xmlText.includes("<rss") || xmlText.includes("<channel")) {
      warnings = await resolveRssFeed(xmlText, env.BMKG_CACHE_TTL_SECONDS);
    } else {
      warnings = parseCapXml(xmlText);
    }

    if (warnings.length > 0) {
      bmkgCache.set(CACHE_KEY, warnings, env.BMKG_CACHE_TTL_SECONDS);
    }

    return warnings;
  } catch (error) {
    // Network error, timeout, or DNS resolution failure
    // RESPONSIBLE AI RULE: If source data is unavailable, do NOT fabricate alerts!
    console.error("Failed to fetch BMKG CAP feed:", error);
    return [];
  }
}

async function resolveRssFeed(
  rssXml: string,
  cacheTtl: number
): Promise<BmkgWarning[]> {
  try {
    const { XMLParser } = await import("fast-xml-parser");
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
      isArray: (name) => name === "item",
    });

    const parsed = parser.parse(rssXml);
    const rawItems = parsed?.rss?.channel?.item;
    if (!rawItems) return [];

    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    const alertLinks: string[] = [];

    for (const item of items) {
      if (
        item &&
        typeof item === "object" &&
        item.link &&
        typeof item.link === "string" &&
        item.link.endsWith(".xml")
      ) {
        alertLinks.push(item.link);
      }
    }

    // Concurrently resolve up to 8 alert XMLs
    const capPromises = alertLinks.slice(0, 8).map(async (link) => {
      // Check cache for individual CAP item
      const itemCacheKey = `bmkg_cap_item_${link}`;
      const cachedItem = bmkgCache.get<BmkgWarning[]>(itemCacheKey);
      if (cachedItem) return cachedItem;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(link, {
          signal: controller.signal,
          headers: { "User-Agent": "SIAGA-BMKG-Warning-Copilot/1.0" },
        });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        const text = await res.text();
        const parsedWarnings = parseCapXml(text);
        if (parsedWarnings.length > 0) {
          bmkgCache.set(itemCacheKey, parsedWarnings, cacheTtl);
        }
        return parsedWarnings;
      } catch {
        return [];
      }
    });

    const results = await Promise.all(capPromises);
    return results.flat();
  } catch (err) {
    console.error("Failed to resolve BMKG RSS feed items:", err);
    return [];
  }
}
