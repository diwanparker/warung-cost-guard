import { describe, it, expect } from "vitest";
import { createDynamicDemoWarnings } from "@/data/demo/scenarios";

describe("Hackathon Demo Scenarios", () => {
  const scenarios = createDynamicDemoWarnings();

  it("Scenario A returns active warning matching Sukolilo campus", () => {
    const scA = scenarios.A;
    const match = scA.getMatchResult(scA.location);

    expect(match.matched).toBe(true);
    expect(match.status).toBe("active");
    expect(match.matchedLocation).toBe("Sukolilo");
    expect(match.source).toBe("BMKG");
    expect(match.warning?.event).toContain("Peringatan Dini Cuaca");
  });

  it("Scenario B returns location mismatch for user in Sukolilo", () => {
    const scB = scenarios.B;
    const match = scB.getMatchResult({
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Sukolilo",
    });

    expect(match.matched).toBe(false);
    expect(match.status).toBe("no_match");
    expect(match.reason).toContain("tidak berada di dalam wilayah terdampak");
  });

  it("Scenario C returns expired warning status", () => {
    const scC = scenarios.C;
    const match = scC.getMatchResult(scC.location);

    expect(match.matched).toBe(true);
    expect(match.status).toBe("expired");
    expect(match.warning?.expires.getTime()).toBeLessThan(Date.now());
  });

  it("Scenario D returns unavailable without fabricating alerts", () => {
    const scD = scenarios.D;
    const match = scD.getMatchResult(scD.location);

    expect(match.matched).toBe(false);
    expect(match.status).toBe("unavailable");
    expect(match.warning).toBeNull();
    expect(match.reason).toContain("tidak dapat diakses");
  });
});
