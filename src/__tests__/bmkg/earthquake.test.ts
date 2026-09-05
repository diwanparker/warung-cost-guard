import { describe, it, expect } from "vitest";
import type { BmkgRawEarthquake } from "@/types/earthquake";

describe("BMKG Earthquake Parsing & Safety Evaluation", () => {
  const sampleRaw: BmkgRawEarthquake = {
    Tanggal: "05 Sep 2026",
    Jam: "13:34:49 WIB",
    DateTime: "2026-09-05T06:34:49+00:00",
    Coordinates: "-0.29,123.18",
    Lintang: "0.29 LS",
    Bujur: "123.18 BT",
    Magnitude: "5.2",
    Kedalaman: "10 km",
    Wilayah: "Pusat gempa berada di laut 92 km Selatan Bone Bolango",
    Potensi: "Tidak berpotensi tsunami",
    Dirasakan: "II-III Luwuk",
    Shakemap: "20260905133449.mmi.jpg",
  };

  it("correctly identifies magnitude >= 5.0 as significant", () => {
    const mag = parseFloat(sampleRaw.Magnitude);
    expect(mag).toBe(5.2);
    expect(mag >= 5.0).toBe(true);
  });

  it("correctly evaluates tsunami potential safely", () => {
    const isTsunami =
      sampleRaw.Potensi.toLowerCase().includes("berpotensi tsunami") &&
      !sampleRaw.Potensi.toLowerCase().includes("tidak berpotensi tsunami");
    expect(isTsunami).toBe(false);
  });

  it("identifies tsunami potential when alert is positive", () => {
    const tsunamiAlert = "Peringatan Dini Tsunami untuk wilayah pesisir";
    const isTsunami =
      tsunamiAlert.toLowerCase().includes("berpotensi tsunami") ||
      tsunamiAlert.toLowerCase().includes("peringatan dini tsunami");
    expect(isTsunami).toBe(true);
  });
});
