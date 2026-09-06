import { describe, it, expect } from "vitest";
import { normalizeCommodity } from "@/lib/market/normalizer";

describe("Commodity Normalizer", () => {
  it("should normalize common trading aliases", () => {
    expect(normalizeCommodity("ayam")).toBe("ayam_ras");
    expect(normalizeCommodity("ayam potong")).toBe("ayam_ras");
    expect(normalizeCommodity("cabe rawit")).toBe("cabai_rawit_merah");
    expect(normalizeCommodity("cabe rawit merah")).toBe("cabai_rawit_merah");
    expect(normalizeCommodity("minyakita")).toBe("minyak_goreng_curah");
    expect(normalizeCommodity("telor")).toBe("telur_ayam_ras");
    expect(normalizeCommodity("brambang")).toBe("bawang_merah");
  });

  it("should handle case insensitivity and whitespace", () => {
    expect(normalizeCommodity("  AYAM BROILER  ")).toBe("ayam_ras");
    expect(normalizeCommodity("Cabe Keriting")).toBe("cabai_merah_keriting");
  });

  it("should fallback gracefully on unknown inputs", () => {
    expect(normalizeCommodity("jagung manis")).toBe("jagung_manis");
    expect(normalizeCommodity("")).toBe("ayam_ras");
  });
});
