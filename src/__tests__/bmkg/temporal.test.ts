import { describe, it, expect } from "vitest";
import {
  getWarningStatus,
  formatWibRange,
  getTimeRemaining,
} from "@/lib/bmkg/temporal";
import type { BmkgWarning } from "@/types/bmkg";

describe("Temporal Validation", () => {
  const baseDate = new Date("2026-09-05T06:00:00.000Z"); // 13:00 WIB

  const createWarning = (effectiveHoursDiff: number, expiresHoursDiff: number): BmkgWarning => {
    return {
      id: "TEST-01",
      event: "Hujan Lebat",
      headline: "Peringatan Cuaca",
      description: "Desc",
      effective: new Date(baseDate.getTime() + effectiveHoursDiff * 3600000),
      expires: new Date(baseDate.getTime() + expiresHoursDiff * 3600000),
      senderName: "BMKG",
      areas: ["Surabaya"],
      sent: new Date(),
    };
  };

  it("identifies active warning when now is between effective and expires", () => {
    // Effective 1 hour ago, expires in 2 hours
    const warning = createWarning(-1, 2);
    const status = getWarningStatus(warning, baseDate);
    expect(status).toBe("active");
  });

  it("identifies expired warning when now is past expires", () => {
    // Effective 3 hours ago, expired 1 hour ago
    const warning = createWarning(-3, -1);
    const status = getWarningStatus(warning, baseDate);
    expect(status).toBe("expired");
  });

  it("identifies upcoming warning when now is before effective", () => {
    // Effective in 1 hour, expires in 4 hours
    const warning = createWarning(1, 4);
    const status = getWarningStatus(warning, baseDate);
    expect(status).toBe("upcoming");
  });

  it("formats time range accurately in WIB (UTC+7)", () => {
    const effective = new Date("2026-09-05T06:05:00.000Z"); // 13:05 WIB
    const expires = new Date("2026-09-05T09:00:00.000Z"); // 16:00 WIB
    const formatted = formatWibRange(effective, expires);
    expect(formatted).toBe("13:05 – 16:00 WIB");
  });

  it("calculates time remaining correctly", () => {
    const warning = createWarning(-1, 2); // expires in 2 hours (120 mins) from baseDate
    const remaining = getTimeRemaining(warning.expires, baseDate);
    expect(remaining.expired).toBe(false);
    expect(remaining.minutes).toBe(120);
    expect(remaining.text).toBe("2 jam tersisa");
  });

  it("reports expired when time remaining is 0 or negative", () => {
    const warning = createWarning(-3, -1);
    const remaining = getTimeRemaining(warning.expires, baseDate);
    expect(remaining.expired).toBe(true);
    expect(remaining.text).toBe("Peringatan telah berakhir");
  });
});
