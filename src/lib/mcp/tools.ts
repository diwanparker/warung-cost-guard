import {
  getActiveWarningInputSchema,
  buildRoleActionPlanInputSchema,
  notifyConfirmedTeamInputSchema,
} from "./schemas";
import { fetchBmkgWarnings } from "@/lib/bmkg/client";
import { matchLocation } from "@/lib/bmkg/matcher";
import { getWarningStatus, formatWibTime } from "@/lib/bmkg/temporal";
import { buildRoleActionPlan } from "@/lib/actions/planner";
import { createDynamicDemoWarnings } from "@/data/demo/scenarios";
import { getEnv } from "@/lib/env";
import type { UserLocation, UserRole } from "@/types/user";

export async function executeGetActiveWarning(rawInput: unknown) {
  const input = getActiveWarningInputSchema.parse(rawInput);
  const userLoc: UserLocation = {
    province: input.province,
    city: input.city,
    district: input.district,
  };

  const env = getEnv();

  // If in DEMO_MODE, return matching demo scenario
  if (env.DEMO_MODE) {
    const demo = createDynamicDemoWarnings();
    const isCampus =
      input.city.toLowerCase().includes("surabaya") &&
      input.district.toLowerCase().includes("sukolilo");

    const scenario = isCampus ? demo.A : demo.B;
    const match = scenario.getMatchResult(userLoc);
    const w = match.warning;

    return {
      matched: match.matched,
      source: "BMKG" as const,
      event: w?.event || null,
      headline: w?.headline || null,
      description: w?.description || null,
      effective: w ? w.effective.toISOString() : null,
      expires: w ? w.expires.toISOString() : null,
      area: w ? w.areas.join("; ") : null,
      matched_location: match.matchedLocation,
      confidence: match.confidence,
      reason: match.reason,
      status: match.status,
    };
  }

  // Live BMKG Feed Execution
  try {
    const warnings = await fetchBmkgWarnings();
    for (const w of warnings) {
      const match = matchLocation(w, userLoc);
      const status = getWarningStatus(w);

      if (match.matched) {
        return {
          matched: true,
          source: "BMKG" as const,
          event: w.event,
          headline: w.headline,
          description: w.description,
          effective: w.effective.toISOString(),
          expires: w.expires.toISOString(),
          area: w.areas.join("; "),
          matched_location: match.matchedLocation,
          confidence: match.confidence,
          reason: match.reason,
          status,
        };
      }
    }

    return {
      matched: false,
      source: "BMKG" as const,
      event: null,
      headline: null,
      description: null,
      effective: null,
      expires: null,
      area: null,
      matched_location: null,
      confidence: "no_match",
      reason: `Tidak ditemukan peringatan aktif untuk Kec. ${input.district}, ${input.city}.`,
      status: "no_match" as const,
    };
  } catch (err) {
    return {
      matched: false,
      source: "BMKG" as const,
      event: null,
      headline: null,
      description: null,
      effective: null,
      expires: null,
      area: null,
      matched_location: null,
      confidence: "no_match",
      reason: "Layanan BMKG tidak dapat dihubungi.",
      status: "unavailable" as const,
    };
  }
}

export async function executeBuildRoleActionPlan(rawInput: unknown) {
  const input = buildRoleActionPlanInputSchema.parse(rawInput);

  const plan = buildRoleActionPlan({
    warning: input.warning,
    role: input.role as UserRole,
    context: input.context,
  });

  return {
    summary: plan.summary,
    risk_context: plan.riskContext,
    priority_actions: plan.priorityActions,
    recommended_actions: plan.recommendedActions,
    monitoring: plan.monitoring,
    do_not_do: plan.doNotDo,
    source_warning: plan.sourceWarning,
    sop_sources: plan.sopSources,
    requires_confirmation: true as const,
  };
}

export async function executeNotifyConfirmedTeam(rawInput: unknown) {
  const input = notifyConfirmedTeamInputSchema.parse(rawInput);

  // RESPONSIBLE AI HARD-GATE:
  if (!input.confirmed) {
    return {
      success: false,
      channel: input.channel,
      recipient_count: 0,
      timestamp: new Date().toISOString(),
      message: "Dibatalkan: Konfirmasi otorisasi manusia tidak diberikan.",
    };
  }

  // Execute mock/real dispatch
  return {
    success: true,
    channel: input.channel,
    recipient_count: input.recipients.length,
    timestamp: new Date().toISOString(),
    message: `Pemberitahuan darurat berhasil dikirimkan ke ${input.recipients.length} penerima melalui kanal ${input.channel}.`,
  };
}
