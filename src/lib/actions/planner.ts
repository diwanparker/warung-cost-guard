import { findRelevantSops } from "@/lib/sop/repository";
import { validateActionPlanSafety } from "./safety";
import { USER_ROLES } from "@/types/user";
import type { ActionPlan, RecommendedAction } from "@/types/action";
import type { WarningMatchResult } from "@/types/bmkg";
import type { UserRole } from "@/types/user";

export interface BuildActionPlanParams {
  warning: WarningMatchResult;
  role: UserRole;
  context?: {
    outdoor_event?: boolean;
    participants?: number;
    notes?: string;
  };
}

export function buildRoleActionPlan({
  warning: matchResult,
  role,
  context,
}: BuildActionPlanParams): ActionPlan {
  const roleMeta = USER_ROLES.find((r) => r.id === role);
  const roleLabel = roleMeta ? roleMeta.label : role;

  // Handle case where no active warning matches
  if (!matchResult.matched || matchResult.status !== "active" || !matchResult.warning) {
    const fallbackPlan: ActionPlan = {
      summary: `Tidak ada peringatan aktif BMKG yang terdeteksi untuk wilayah terpantau. Peran ${roleLabel} dapat menjalankan operasional standar dengan tetap memantau kanal informasi berkala.`,
      riskContext: "Kondisi cuaca terpantau normal pada data resmi yang diperiksa. Tidak ada indikasi cuaca ekstrem.",
      priorityActions: [],
      recommendedActions: [
        {
          id: "act-std-1",
          action: "Lanjutkan operasional normal sesuai jadwal kerja harian.",
          reason: "Tidak terdapat peringatan dini cuaca aktif pada basis data BMKG.",
          priority: "medium",
          source: "SOP Operasional Reguler",
          completed: false,
        },
      ],
      monitoring: [
        {
          id: "act-std-2",
          action: "Pantau pembaruan cuaca BMKG berkala melalui kanal resmi.",
          reason: "Kesiapsiagaan rutin terhadap perubahan cuaca lokal.",
          priority: "low",
          source: "Pedoman K3 Institusi",
          completed: false,
        },
      ],
      doNotDo: ["Jangan mengabaikan protokol darurat jika sewaktu-waktu terjadi perubahan cuaca mendadak di lapangan."],
      sourceWarning: "BMKG",
      sopSources: ["Pedoman Kesiapsiagaan Umum"],
      requiresConfirmation: true,
    };
    return fallbackPlan;
  }

  const w = matchResult.warning;
  const eventDesc = `${w.event} ${w.description} ${w.headline}`;

  // Retrieve relevant SOP documents
  const matchedSops = findRelevantSops(eventDesc, role, context);

  // If no specific SOP matched, fallback to the heavy rain SOP
  const sopsToUse = matchedSops.length > 0 ? matchedSops : findRelevantSops("Hujan Lebat", role, context);

  const priorityActions: RecommendedAction[] = [];
  const recommendedActions: RecommendedAction[] = [];
  const monitoringActions: RecommendedAction[] = [];
  const doNotDoSet = new Set<string>();
  const sopSourcesSet = new Set<string>();

  let idCounter = 1;

  for (const sop of sopsToUse) {
    sopSourcesSet.add(`${sop.title} (${sop.organization}, v${sop.version})`);

    // High priority
    for (const item of sop.highPriorityActions) {
      priorityActions.push({
        id: `act-p1-${idCounter++}`,
        action: item,
        reason: `Diharuskan oleh SOP saat terjadi ${w.event} di area aktif.`,
        priority: "high",
        source: sop.source,
        completed: false,
      });
    }

    // Medium priority
    for (const item of sop.mediumPriorityActions) {
      recommendedActions.push({
        id: `act-p2-${idCounter++}`,
        action: item,
        reason: `Langkah mitigasi fasilitas untuk peran ${roleLabel}.`,
        priority: "medium",
        source: sop.source,
        completed: false,
      });
    }

    // Monitoring
    for (const item of sop.monitoringActions) {
      monitoringActions.push({
        id: `act-p3-${idCounter++}`,
        action: item,
        reason: `Pengawasan berkala selama periode peringatan hingga berakhir.`,
        priority: "low",
        source: sop.source,
        completed: false,
      });
    }

    // Prohibitions
    for (const dnd of sop.doNotDo) {
      doNotDoSet.add(dnd);
    }
  }

  // Inject outdoor context if specified
  if (context?.outdoor_event) {
    const countInfo = context.participants ? ` (melibatkan ±${context.participants} peserta)` : "";
    priorityActions.unshift({
      id: `act-ctx-${idCounter++}`,
      action: `Lakukan evaluasi penghentian sementara dan alihkan kegiatan luar ruangan${countInfo} ke gedung penampungan bertingkat.`,
      reason: `Peringatan BMKG aktif (${w.event}) berisiko langsung terhadap keselamatan massa di lapangan terbuka.`,
      priority: "high",
      source: "Protokol Kontinjensi Acara Terbuka",
      completed: false,
    });
  }

  const riskContext = `Peringatan BMKG ${w.event} aktif mencakup wilayah ${matchResult.matchedLocation || "kampus"}. Potensi dampak langsung bagi ${roleLabel}: bahaya kilat terbuka, terpaan angin terhadap kanopi/instalasi sementara, dan genangan air pada koridor akses${context?.participants ? `. Kegiatan outdoor melibatkan ±${context.participants} orang wajib diproteksi.` : "."}`;

  const plan: ActionPlan = {
    summary: `Rencana tindakan kesiapsiagaan darurat untuk peran ${roleLabel} merespons peringatan resmi BMKG (${w.event}) yang aktif di wilayah Anda. Terdiri dari ${priorityActions.length} tindakan prioritas utama, ${recommendedActions.length} tindakan pencegahan, dan ${monitoringActions.length} pengawasan berkala.`,
    riskContext,
    priorityActions,
    recommendedActions,
    monitoring: monitoringActions,
    doNotDo: Array.from(doNotDoSet),
    sourceWarning: "BMKG",
    sopSources: Array.from(sopSourcesSet),
    requiresConfirmation: true,
  };

  // Run safety validation check
  const safetyCheck = validateActionPlanSafety(plan, matchResult);
  if (!safetyCheck.valid) {
    console.warn("Safety validation warnings in action plan:", safetyCheck.violations);
  }

  return plan;
}
