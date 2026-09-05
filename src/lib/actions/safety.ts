import type { ActionPlan } from "@/types/action";
import type { WarningMatchResult } from "@/types/bmkg";

export interface SafetyValidationResult {
  valid: boolean;
  violations: string[];
}

export function validateActionPlanSafety(
  plan: ActionPlan,
  warningResult: WarningMatchResult
): SafetyValidationResult {
  const violations: string[] = [];

  // Rule 1: Consequential actions must require human confirmation
  if (!plan.requiresConfirmation) {
    violations.push("Rencana tindakan eksternal wajib menyertakan gerbang konfirmasi manusia (requiresConfirmation = true).");
  }

  // Rule 2: Official source must be BMKG
  if (plan.sourceWarning !== "BMKG") {
    violations.push("Sumber data peringatan resmi wajib merujuk ke BMKG.");
  }

  // Rule 3: Must not make dangerous false-safety claims
  const allText = (
    plan.summary +
    " " +
    plan.riskContext +
    " " +
    plan.priorityActions.map((a) => a.action).join(" ")
  ).toLowerCase();

  if (allText.includes("pasti aman") || allText.includes("cuaca 100% aman")) {
    violations.push("Sistem dilarang memberikan klaim absolut bahwa kondisi cuaca 'pasti aman'.");
  }

  // Rule 4: If warning is inactive or unavailable, cannot produce urgent priority actions
  if (!warningResult.matched || warningResult.status !== "active") {
    if (plan.priorityActions.length > 0) {
      violations.push("Tidak boleh menerbitkan tindakan darurat prioritas tinggi jika tidak ada peringatan BMKG aktif yang cocok.");
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}
