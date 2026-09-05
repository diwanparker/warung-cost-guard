import { describe, it, expect } from "vitest";
import { matchLocation, normalizeGeoString } from "@/lib/bmkg/matcher";
import type { BmkgWarning } from "@/types/bmkg";

const mockWarning: BmkgWarning = {
  id: "WARN-01",
  event: "Hujan Lebat",
  headline: "Peringatan Dini Jawa Timur",
  description: "Berpotensi hujan lebat di Kota Surabaya: Kec. Sukolilo, Kec. Rungkut, dan sekitarnya.",
  effective: new Date(),
  expires: new Date(Date.now() + 3600000),
  senderName: "BMKG",
  areas: ["Kota Surabaya (Kec. Sukolilo, Kec. Rungkut)"],
  sent: new Date(),
};

describe("Location Matcher", () => {
  it("normalizes administrative prefixes and punctuation correctly", () => {
    expect(normalizeGeoString("Kec. Sukolilo")).toBe("sukolilo");
    expect(normalizeGeoString("Kecamatan Rungkut,")).toBe("rungkut");
    expect(normalizeGeoString("Kota   Surabaya")).toBe("surabaya");
    expect(normalizeGeoString("Kabupaten Sidoarjo")).toBe("sidoarjo");
    expect(normalizeGeoString("Kab. Gresik.")).toBe("gresik");
  });

  it("matches district with exact confidence", () => {
    const result = matchLocation(mockWarning, {
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Sukolilo",
    });

    expect(result.matched).toBe(true);
    expect(result.confidence).toBe("exact");
    expect(result.matchedLocation).toBe("Sukolilo");
    expect(result.matchedField).toBe("areas");
  });

  it("matches district with normalized confidence when prefixes differ", () => {
    const result = matchLocation(mockWarning, {
      province: "Jawa Timur",
      city: "Kota Surabaya",
      district: "Kecamatan Sukolilo",
    });

    expect(result.matched).toBe(true);
    expect(["exact", "normalized"]).toContain(result.confidence);
  });

  it("returns probable confidence when city matches but district is not specified in warning", () => {
    const cityOnlyWarning: BmkgWarning = {
      ...mockWarning,
      areas: ["Kota Surabaya secara umum"],
      description: "Hujan merata di wilayah Kota Surabaya.",
    };

    const result = matchLocation(cityOnlyWarning, {
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Wonokromo",
    });

    expect(result.matched).toBe(true);
    expect(result.confidence).toBe("probable");
    expect(result.matchedLocation).toBe("Surabaya");
  });

  it("returns no_match when user location is completely outside warning area", () => {
    const result = matchLocation(mockWarning, {
      province: "Jawa Timur",
      city: "Malang",
      district: "Klojen",
    });

    expect(result.matched).toBe(false);
    expect(result.confidence).toBe("no_match");
    expect(result.matchedLocation).toBeNull();
  });

  it("returns ambiguous when location inputs are empty or blank", () => {
    const result = matchLocation(mockWarning, {
      province: "",
      city: "",
      district: "",
    });

    expect(result.matched).toBe(false);
    expect(result.confidence).toBe("ambiguous");
  });
});
