import { describe, it, expect } from "vitest";
import { buildRoleActionPlan } from "@/lib/actions/planner";
import type { WarningMatchResult } from "@/types/bmkg";

const mockActiveMatch: WarningMatchResult = {
  matched: true,
  status: "active",
  warning: {
    id: "BMKG-001",
    event: "Hujan Lebat Disertai Petir dan Angin Kencang",
    headline: "Peringatan Dini Cuaca Ekstrem Surabaya",
    description: "Hujan lebat disertai kilat dan angin kencang di Sukolilo.",
    effective: new Date(),
    expires: new Date(Date.now() + 7200000),
    senderName: "BMKG",
    areas: ["Sukolilo"],
    sent: new Date(),
  },
  matchedLocation: "Sukolilo",
  confidence: "exact",
  matchedField: "areas",
  reason: "Sukolilo tercantum secara spesifik.",
  source: "BMKG",
};

describe("Action Plan Builder", () => {
  it("builds a role-specific action plan for campus_operations", () => {
    const plan = buildRoleActionPlan({
      warning: mockActiveMatch,
      role: "campus_operations",
    });

    expect(plan.requiresConfirmation).toBe(true);
    expect(plan.sourceWarning).toBe("BMKG");
    expect(plan.priorityActions.length).toBeGreaterThan(0);
    expect(plan.recommendedActions.length).toBeGreaterThan(0);
    expect(plan.monitoring.length).toBeGreaterThan(0);
    expect(plan.doNotDo.length).toBeGreaterThan(0);
    expect(plan.sopSources.length).toBeGreaterThan(0);
    expect(plan.summary).toContain("Operasional Kampus");
  });

  it("adds outdoor event safety actions when outdoor_event context is true", () => {
    const plan = buildRoleActionPlan({
      warning: mockActiveMatch,
      role: "event_organizer",
      context: { outdoor_event: true, participants: 150 },
    });

    expect(plan.priorityActions.some((a) => a.action.toLowerCase().includes("indoor") || a.action.toLowerCase().includes("outdoor"))).toBe(true);
    expect(plan.riskContext).toContain("150");
  });

  it("handles inactive or non-matching warning safely", () => {
    const inactiveMatch: WarningMatchResult = {
      matched: false,
      status: "no_match",
      warning: null,
      matchedLocation: null,
      confidence: "no_match",
      matchedField: null,
      reason: "Tidak ada peringatan",
      source: "BMKG",
    };

    const plan = buildRoleActionPlan({
      warning: inactiveMatch,
      role: "campus_operations",
    });

    expect(plan.priorityActions).toHaveLength(0);
    expect(plan.summary).toContain("Tidak ada peringatan aktif");
  });
});
