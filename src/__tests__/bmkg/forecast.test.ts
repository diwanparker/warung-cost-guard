import { describe, it, expect } from "vitest";
import { resolveAdm4Code } from "@/lib/bmkg/forecast";

describe("BMKG Forecast Location Resolver", () => {
  it("resolves Surabaya Sukolilo to correct adm4 code", () => {
    const code = resolveAdm4Code("Surabaya", "Sukolilo");
    expect(code).toBe("35.78.13.1001");
  });

  it("resolves Jakarta Kemayoran to correct adm4 code", () => {
    const code = resolveAdm4Code("Jakarta", "Kemayoran");
    expect(code).toBe("31.71.03.1001");
  });

  it("resolves Bandung Coblong to correct adm4 code", () => {
    const code = resolveAdm4Code("Bandung", "Coblong");
    expect(code).toBe("32.73.07.1001");
  });

  it("falls back to Surabaya default code for unknown area", () => {
    const code = resolveAdm4Code("UnknownCity", "UnknownDistrict");
    expect(code).toBe("35.78.13.1001");
  });
});
