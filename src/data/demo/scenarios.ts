import type { BmkgWarning, WarningMatchResult } from "@/types/bmkg";
import type { UserLocation } from "@/types/user";

export interface DemoScenario {
  id: "A" | "B" | "C" | "D";
  name: string;
  description: string;
  location: UserLocation;
  getWarning: () => BmkgWarning | null;
  getMatchResult: (location?: UserLocation) => WarningMatchResult;
}

export function createDynamicDemoWarnings(now: Date = new Date()): Record<"A" | "B" | "C" | "D", DemoScenario> {
  const currentMs = now.getTime();

  // Scenario A: Active Warning matching Sukolilo, Surabaya
  const warningA: BmkgWarning = {
    id: `BMKG-NOWCAST-${now.toISOString().slice(0, 10)}-001`,
    event: "Peringatan Dini Cuaca Ekstrem",
    headline: "Peringatan Dini Cuaca Jawa Timur (Wilayah Surabaya & Sekitarnya)",
    description:
      "Berpotensi terjadi Hujan Sedang hingga Lebat yang dapat disertai Kilat/Petir dan Angin Kencang pada periode siang hingga sore hari di wilayah Kota Surabaya (Kec. Sukolilo, Kec. Rungkut, Kec. Gubeng, Kec. Mulyorejo), Kab. Sidoarjo (Kec. Waru, Kec. Sedati), dan sekitarnya.",
    effective: new Date(currentMs - 45 * 60 * 1000), // started 45 mins ago
    expires: new Date(currentMs + 135 * 60 * 1000), // expires in 2 hours 15 mins
    senderName: "Stasiun Meteorologi Kelas I Juanda Surabaya - BMKG",
    areas: [
      "Kota Surabaya (Kec. Sukolilo, Kec. Rungkut, Kec. Gubeng, Kec. Mulyorejo)",
      "Kab. Sidoarjo (Kec. Waru, Kec. Sedati)",
    ],
    polygon: "-7.27,112.78 -7.31,112.82 -7.33,112.78 -7.28,112.75 -7.27,112.78",
    sourceUrl: "https://signature.bmkg.go.id/alert/nowcast/jatim-001",
    severity: "Severe",
    urgency: "Expected",
    certainty: "Likely",
    sent: new Date(currentMs - 50 * 60 * 1000),
  };

  // Scenario B: Warning exists for different region (Banyuwangi & Jember)
  const warningB: BmkgWarning = {
    id: `BMKG-NOWCAST-${now.toISOString().slice(0, 10)}-002`,
    event: "Peringatan Dini Cuaca Ekstrem",
    headline: "Peringatan Dini Cuaca Jawa Timur (Wilayah Tapal Kuda)",
    description:
      "Berpotensi terjadi Hujan Lebat disertai Angin Kencang di Kabupaten Banyuwangi (Kec. Rogojampi, Kec. Kabat), Kabupaten Jember (Kec. Silo).",
    effective: new Date(currentMs - 30 * 60 * 1000),
    expires: new Date(currentMs + 90 * 60 * 1000),
    senderName: "Stasiun Meteorologi Kelas I Juanda Surabaya - BMKG",
    areas: ["Kab. Banyuwangi (Kec. Rogojampi, Kec. Kabat)", "Kab. Jember (Kec. Silo)"],
    sourceUrl: "https://signature.bmkg.go.id/alert/nowcast/jatim-002",
    severity: "Severe",
    sent: new Date(currentMs - 35 * 60 * 1000),
  };

  // Scenario C: Expired Warning
  const warningC: BmkgWarning = {
    id: `BMKG-NOWCAST-${now.toISOString().slice(0, 10)}-003`,
    event: "Peringatan Dini Cuaca",
    headline: "Peringatan Dini Cuaca Jawa Timur (Siklus Pagi)",
    description:
      "Potensi hujan sedang disertai kilat di Kota Surabaya (Kec. Sukolilo). Kondisi telah melandai.",
    effective: new Date(currentMs - 4 * 3600 * 1000),
    expires: new Date(currentMs - 60 * 60 * 1000), // ended 1 hour ago
    senderName: "Stasiun Meteorologi Kelas I Juanda Surabaya - BMKG",
    areas: ["Kota Surabaya (Kec. Sukolilo)"],
    sourceUrl: "https://signature.bmkg.go.id/alert/nowcast/jatim-003",
    sent: new Date(currentMs - 4 * 3600 * 1000),
  };

  return {
    A: {
      id: "A",
      name: "Skenario A: Peringatan Aktif Cocok (Sukolilo)",
      description: "Peringatan aktif BMKG yang secara eksplisit mencakup lokasi kampus (Kec. Sukolilo, Surabaya).",
      location: {
        province: "Jawa Timur",
        city: "Surabaya",
        district: "Sukolilo",
      },
      getWarning: () => warningA,
      getMatchResult: () => ({
        matched: true,
        status: "active",
        warning: warningA,
        matchedLocation: "Sukolilo",
        confidence: "exact",
        matchedField: "areas",
        reason: "Kecamatan Sukolilo tercantum secara spesifik pada daftar area terdampak peringatan dini aktif BMKG.",
        source: "BMKG",
      }),
    },
    B: {
      id: "B",
      name: "Skenario B: Lokasi Tidak Cocok (Mismatch)",
      description: "Peringatan BMKG aktif di Jawa Timur, namun lokasi pengguna berada di luar area terdampak.",
      location: {
        province: "Jawa Timur",
        city: "Surabaya",
        district: "Sukolilo",
      },
      getWarning: () => warningB,
      getMatchResult: (loc) => ({
        matched: false,
        status: "no_match",
        warning: null,
        matchedLocation: null,
        confidence: "no_match",
        matchedField: null,
        reason: `Lokasi ${loc?.district || "Sukolilo"}, ${loc?.city || "Surabaya"} tidak berada di dalam wilayah terdampak peringatan BMKG saat ini.`,
        source: "BMKG",
      }),
    },
    C: {
      id: "C",
      name: "Skenario C: Peringatan Telah Berakhir",
      description: "Peringatan BMKG sebelumnya pernah aktif untuk lokasi ini, namun waktu kedaluwarsa telah terlewati.",
      location: {
        province: "Jawa Timur",
        city: "Surabaya",
        district: "Sukolilo",
      },
      getWarning: () => warningC,
      getMatchResult: () => ({
        matched: true,
        status: "expired",
        warning: warningC,
        matchedLocation: "Sukolilo",
        confidence: "exact",
        matchedField: "areas",
        reason: "Peringatan untuk wilayah Sukolilo telah melewati batas waktu kedaluwarsa resmi BMKG.",
        source: "BMKG",
      }),
    },
    D: {
      id: "D",
      name: "Skenario D: Layanan BMKG Tidak Tersedia",
      description: "Simulasi kegagalan koneksi/gangguan server BMKG tanpa membuat peringatan palsu.",
      location: {
        province: "Jawa Timur",
        city: "Surabaya",
        district: "Sukolilo",
      },
      getWarning: () => null,
      getMatchResult: () => ({
        matched: false,
        status: "unavailable",
        warning: null,
        matchedLocation: null,
        confidence: "no_match",
        matchedField: null,
        reason: "Feed CAP BMKG sementara tidak dapat diakses. Sistem tidak akan mengarang prakiraan.",
        source: "BMKG",
      }),
    },
  };
}
