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
    const warnings = parseCapXml(xmlText);

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
