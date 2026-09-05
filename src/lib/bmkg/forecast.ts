import { bmkgCache } from "./cache";
import type { LocationForecast, WeatherInterval } from "@/types/forecast";

const CACHE_TTL_SECONDS = 900; // 15 minutes

// Common administrative code mapping (Kemendagri No. 100.1.1-6117 Tahun 2022)
const LOCATION_ADM4_MAP: Record<string, string> = {
  "surabaya-sukolilo": "35.78.13.1001",
  "surabaya-gubeng": "35.78.07.1001",
  "surabaya-wonokromo": "35.78.04.1001",
  "jakarta-kemayoran": "31.71.03.1001",
  "jakarta-gambir": "31.71.01.1001",
  "bandung-coblong": "32.73.07.1001",
  "malang-lowokwaru": "35.73.05.1001",
  "yogyakarta-depok": "34.04.07.2001",
};

export function resolveAdm4Code(city?: string, district?: string): string {
  const key = `${city || ""}-${district || ""}`.toLowerCase().replace(/[^a-z0-9-]/g, "");
  for (const [mapKey, code] of Object.entries(LOCATION_ADM4_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return code;
    }
  }
  // Default to Surabaya Sukolilo
  return "35.78.13.1001";
}

export async function fetchWeatherForecast(
  adm4Code = "35.78.13.1001",
  forceRefresh = false
): Promise<LocationForecast | null> {
  const cacheKey = `bmkg_forecast_${adm4Code}`;

  if (!forceRefresh) {
    const cached = bmkgCache.get<LocationForecast>(cacheKey);
    if (cached) return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(
        adm4Code
      )}`,
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
      console.warn(`BMKG Forecast API returned status ${response.status}`);
      return null;
    }

    const json = await response.json();
    const lokasi = json?.lokasi || json?.data?.[0]?.lokasi;
    const rawCuacaList = json?.data?.[0]?.cuaca;

    if (!rawCuacaList) return null;

    // rawCuacaList may be nested arrays per day: [[day1...], [day2...]] or flat
    const flatItems: Array<Record<string, unknown>> = Array.isArray(rawCuacaList)
      ? rawCuacaList.flat()
      : [];

    const intervals: WeatherInterval[] = flatItems.map((item) => {
      const localStr = String(item.local_datetime || item.datetime || "");
      // Parse local time
      let timeFormatted = "";
      let dateFormatted = "";
      if (localStr) {
        const parts = localStr.split(" ");
        if (parts.length >= 2) {
          dateFormatted = parts[0].slice(5); // MM-DD
          timeFormatted = `${parts[1].slice(0, 5)} WIB`;
        }
      }

      return {
        datetime: String(item.datetime || ""),
        localDatetime: localStr,
        timeFormatted: timeFormatted || "WIB",
        dateFormatted: dateFormatted || "",
        temperature: Number(item.t) || 28,
        humidity: Number(item.hu) || 70,
        weatherDesc: String(item.weather_desc || "Cerah"),
        weatherCode: Number(item.weather) || 1,
        windSpeed: Number(item.ws) || 10,
        windDirection: String(item.wd || "N"),
        cloudCover: Number(item.tcc) || 50,
        visibility: String(item.vs_text || "> 10 km"),
        iconUrl: String(
          item.image ||
            "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah berawan-am.svg"
        ),
      };
    });

    const result: LocationForecast = {
      province: lokasi?.provinsi || "Jawa Timur",
      city: lokasi?.kotkab || "Kota Surabaya",
      district: lokasi?.kecamatan || "Sukolilo",
      village: lokasi?.desa || "Keputih",
      adm4: adm4Code,
      current: intervals.length > 0 ? intervals[0] : null,
      intervals: intervals.slice(0, 8), // Next 24 hours (8 intervals of 3 hours)
      source: "BMKG",
    };

    bmkgCache.set(cacheKey, result, CACHE_TTL_SECONDS);
    return result;
  } catch (error) {
    console.error("Failed to fetch BMKG Weather Forecast:", error);
    return null;
  }
}
