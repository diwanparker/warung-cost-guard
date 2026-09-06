import { getEnv } from "@/lib/env";
import type { BpsIndicator, BpsDataset, BpsRegion } from "@/types/bps";

const DEMO_INFLATION_INDICATOR: BpsIndicator = {
  indicator_id: "BPS-INF-JATIM",
  region_code: "3500", // Jawa Timur
  table_id: "INF-001",
  title: "Inflasi Kelompok Makanan, Minuman, dan Tembakau Jawa Timur",
  note: "Tingkat inflasi tahunan (y-on-y) komoditas pangan bergejolak",
  last_updated: "2026-09-01T00:00:00Z",
  record_count: 5,
  time_series: [
    { period: "2026-05", value: 2.84 },
    { period: "2026-06", value: 2.95 },
    { period: "2026-07", value: 3.08 },
    { period: "2026-08", value: 3.19 },
    { period: "2026-09", value: 3.22 },
  ],
};

export async function fetchBpsFoodInflation(regionCode: string = "3500"): Promise<BpsIndicator> {
  const env = getEnv();

  if (!env.BPS_API_KEY) {
    // Return curated baseline if API key not provided, as documented in DataRakyat
    return {
      ...DEMO_INFLATION_INDICATOR,
      region_code: regionCode,
    };
  }

  try {
    const url = `${env.BPS_BASE_URL}/indicator/570?key=${env.BPS_API_KEY}&region=${regionCode}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`BPS API error status: ${res.status}`);
    const data = await res.json();
    return data.result || DEMO_INFLATION_INDICATOR;
  } catch (error) {
    console.warn("BPS live fetch failed, returning baseline:", error);
    return DEMO_INFLATION_INDICATOR;
  }
}
