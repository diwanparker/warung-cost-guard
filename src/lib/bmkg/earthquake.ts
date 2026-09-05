import { bmkgCache } from "./cache";
import type { BmkgRawEarthquake, EarthquakeData } from "@/types/earthquake";

const CACHE_KEY = "bmkg_latest_earthquake";
const CACHE_TTL_SECONDS = 120; // 2 minutes

export async function fetchLatestEarthquake(
  forceRefresh = false
): Promise<EarthquakeData | null> {
  if (!forceRefresh) {
    const cached = bmkgCache.get<EarthquakeData>(CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "SIAGA-BMKG-Warning-Copilot/1.0",
        },
        next: { revalidate: CACHE_TTL_SECONDS },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `BMKG Earthquake feed responded with status ${response.status}`
      );
      return null;
    }

    const json = await response.json();
    const raw: BmkgRawEarthquake | undefined = json?.Infogempa?.gempa;
    if (!raw) return null;

    const magnitude = parseFloat(raw.Magnitude) || 0;
    const isTsunamiPotential =
      raw.Potensi.toLowerCase().includes("berpotensi tsunami") &&
      !raw.Potensi.toLowerCase().includes("tidak berpotensi tsunami");

    const data: EarthquakeData = {
      id: `EQ-${raw.DateTime || Date.now()}`,
      date: raw.Tanggal,
      time: raw.Jam,
      dateTime: raw.DateTime,
      coordinates: raw.Coordinates,
      latitude: raw.Lintang,
      longitude: raw.Bujur,
      magnitude,
      depth: raw.Kedalaman,
      region: raw.Wilayah,
      potential: raw.Potensi,
      felt: raw.Dirasakan,
      shakemapUrl: raw.Shakemap
        ? `https://data.bmkg.go.id/DataMKG/TEWS/${raw.Shakemap}`
        : undefined,
      isTsunamiPotential,
      isSignificant: magnitude >= 5.0,
      source: "BMKG",
    };

    bmkgCache.set(CACHE_KEY, data, CACHE_TTL_SECONDS);
    return data;
  } catch (error) {
    console.error("Failed to fetch BMKG Earthquake feed:", error);
    return null;
  }
}
