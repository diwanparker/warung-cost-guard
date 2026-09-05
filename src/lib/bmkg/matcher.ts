import type { BmkgWarning, MatchConfidence } from "@/types/bmkg";
import type { UserLocation } from "@/types/user";

export interface LocationMatchDetail {
  matched: boolean;
  confidence: MatchConfidence;
  matchedLocation: string | null;
  matchedField: "areas" | "description" | "headline" | null;
  reason: string;
}

const ADMIN_PREFIX_REGEX =
  /\b(kecamatan|kec\.?|kabupaten|kab\.?|kota|provinsi|prov\.?|kelurahan|kel\.?|desa)\b/gi;

export function normalizeGeoString(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(ADMIN_PREFIX_REGEX, "")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchLocation(
  warning: BmkgWarning,
  location: UserLocation
): LocationMatchDetail {
  const normDistrict = normalizeGeoString(location.district);
  const normCity = normalizeGeoString(location.city);

  if (!normDistrict && !normCity) {
    return {
      matched: false,
      confidence: "ambiguous",
      matchedLocation: null,
      matchedField: null,
      reason: "Lokasi pengguna tidak terdefinisi atau terlalu ambigu.",
    };
  }

  // Helper to test if a text target contains normalized location token
  const checkMatch = (rawText: string, searchToken: string): boolean => {
    if (!rawText || !searchToken) return false;
    const normalizedTarget = normalizeGeoString(rawText);
    const regex = new RegExp(`\\b${searchToken}\\b`, "i");
    return regex.test(normalizedTarget);
  };

  const areasJoined = warning.areas.join(" ");

  // 1. Check District in areas
  if (normDistrict) {
    if (checkMatch(areasJoined, normDistrict)) {
      const isExact = new RegExp(`\\b${location.district.trim()}\\b`, "i").test(
        areasJoined
      );
      return {
        matched: true,
        confidence: isExact ? "exact" : "normalized",
        matchedLocation: location.district,
        matchedField: "areas",
        reason: `Kecamatan ${location.district} tercantum secara spesifik pada daftar area terdampak BMKG.`,
      };
    }

    // Check District in description
    if (checkMatch(warning.description, normDistrict)) {
      return {
        matched: true,
        confidence: "normalized",
        matchedLocation: location.district,
        matchedField: "description",
        reason: `Kecamatan ${location.district} disebutkan dalam rincian peringatan BMKG.`,
      };
    }
  }

  // 2. Check City in areas or description
  if (normCity) {
    if (checkMatch(areasJoined, normCity)) {
      return {
        matched: true,
        confidence: "probable",
        matchedLocation: location.city,
        matchedField: "areas",
        reason: `Wilayah ${location.city} termasuk dalam cakupan umum peringatan, namun kecamatan spesifik (${location.district || "tidak ditentukan"}) belum terinci.`,
      };
    }

    if (checkMatch(warning.description, normCity)) {
      return {
        matched: true,
        confidence: "probable",
        matchedLocation: location.city,
        matchedField: "description",
        reason: `Kota/Kabupaten ${location.city} disebutkan dalam narasi cuaca BMKG.`,
      };
    }

    if (checkMatch(warning.headline, normCity)) {
      return {
        matched: true,
        confidence: "probable",
        matchedLocation: location.city,
        matchedField: "headline",
        reason: `Kota/Kabupaten ${location.city} tercantum pada judul peringatan BMKG.`,
      };
    }
  }

  return {
    matched: false,
    confidence: "no_match",
    matchedLocation: null,
    matchedField: null,
    reason: `Lokasi ${location.district ? `Kec. ${location.district}, ` : ""}${location.city} berada di luar area terdampak peringatan ini.`,
  };
}
