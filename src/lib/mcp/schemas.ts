import { z } from "zod";

// Tool 1: get_active_bmkg_warning
export const getActiveWarningInputSchema = z.object({
  province: z.string().default("Jawa Timur"),
  city: z.string().default("Surabaya"),
  district: z.string().describe("Nama kecamatan yang ingin diperiksa (contoh: Sukolilo)"),
});

export const getActiveWarningOutputSchema = z.object({
  matched: z.boolean(),
  source: z.literal("BMKG"),
  event: z.string().nullable(),
  headline: z.string().nullable(),
  description: z.string().nullable(),
  effective: z.string().nullable(),
  expires: z.string().nullable(),
  area: z.string().nullable(),
  matched_location: z.string().nullable(),
  confidence: z.string(),
  reason: z.string(),
  status: z.enum(["active", "expired", "upcoming", "no_match", "unavailable", "ambiguous"]),
});

// Tool 2: build_role_action_plan
export const buildRoleActionPlanInputSchema = z.object({
  warning: z.any().describe("Objek warning dari tool get_active_bmkg_warning"),
  role: z
    .enum([
      "campus_operations",
      "campus_security",
      "event_organizer",
      "school_operations",
      "factory_operations",
      "warehouse_operations",
      "logistics",
      "community_leader",
    ])
    .default("campus_operations"),
  context: z
    .object({
      outdoor_event: z.boolean().optional(),
      participants: z.number().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export const buildRoleActionPlanOutputSchema = z.object({
  summary: z.string(),
  risk_context: z.string(),
  priority_actions: z.array(z.any()),
  recommended_actions: z.array(z.any()),
  monitoring: z.array(z.any()),
  do_not_do: z.array(z.string()),
  source_warning: z.literal("BMKG"),
  sop_sources: z.array(z.string()),
  requires_confirmation: z.literal(true),
});

// Tool 3: notify_confirmed_team
export const notifyConfirmedTeamInputSchema = z.object({
  confirmed: z
    .boolean()
    .describe("Wajib true. Aksi eksternal hanya dieksekusi jika pengguna memberikan otorisasi eksplisit."),
  recipients: z.array(z.string()).min(1).describe("Daftar alamat email atau kontak tim tujuan"),
  message: z.string().min(5).describe("Isi ringkasan notifikasi kesiapsiagaan darurat"),
  channel: z.enum(["email", "whatsapp", "task", "mock"]).default("mock"),
  actionPlanId: z.string().optional(),
});

export const notifyConfirmedTeamOutputSchema = z.object({
  success: z.boolean(),
  channel: z.string(),
  recipient_count: z.number(),
  timestamp: z.string(),
  message: z.string(),
});
