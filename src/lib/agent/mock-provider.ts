import { createDynamicDemoWarnings } from "@/data/demo/scenarios";
import { buildRoleActionPlan } from "@/lib/actions/planner";
import { formatWibTime, formatWibRange } from "@/lib/bmkg/temporal";
import type { AgentProvider, ChatMessage, ChatContext } from "./types";
import type { UserRole } from "@/types/user";

export class MockAgentProvider implements AgentProvider {
  async sendMessage(
    userText: string,
    history: ChatMessage[],
    context: ChatContext
  ): Promise<ChatMessage> {
    const text = userText.toLowerCase().trim();
    const id = `msg-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const scenarioKey = context.scenario && context.scenario !== "LIVE" ? context.scenario : "A";
    const demoWarnings = createDynamicDemoWarnings();
    const scenario = demoWarnings[scenarioKey];
    const matchResult = scenario.getMatchResult(context.location);

    // 1. User asks about warnings or greetings
    if (
      text.includes("warning") ||
      text.includes("peringatan") ||
      text.includes("cuaca") ||
      text.includes("kampus") ||
      text.includes("halo") ||
      text.includes("hai") ||
      text.includes("cek")
    ) {
      if (matchResult.status === "active" && matchResult.warning) {
        const w = matchResult.warning;
        const timeRange = formatWibRange(w.effective, w.expires);

        return {
          id,
          sender: "assistant",
          text: `Halo! Saya memeriksa data resmi BMKG CAP untuk wilayah **Kec. ${context.location.district}, ${context.location.city}**.\n\n⚠️ **Ditemukan 1 Peringatan Dini Aktif:**\n* **Peristiwa:** ${w.event}\n* **Periode:** ${timeRange}\n* **Wilayah Cocok:** ${matchResult.matchedLocation || context.location.district}\n* **Sumber:** BMKG (${w.senderName})\n\nUntuk menyusun rekomendasi tindakan SOP yang tepat sasaran, apa peran operasional Anda saat ini?`,
          timestamp,
          toolCalls: [
            {
              name: "get_active_bmkg_warning",
              args: {
                province: context.location.province,
                city: context.location.city,
                district: context.location.district,
              },
              status: "completed",
            },
          ],
          quickReplies: [
            { label: "Operasional Kampus", payload: "role:campus_operations" },
            { label: "Security Kampus", payload: "role:campus_security" },
            { label: "Panitia Event / Outdoor", payload: "role:event_organizer" },
            { label: "Operasional Sekolah", payload: "role:school_operations" },
          ],
        };
      } else if (matchResult.status === "expired") {
        return {
          id,
          sender: "assistant",
          text: `Saya telah memeriksa feed BMKG untuk **Kec. ${context.location.district}, ${context.location.city}**.\n\n⧗ **Peringatan Telah Berakhir.** Data peringatan sebelumnya telah melampaui masa berlaku resmi BMKG. Saat ini tidak ada status darurat aktif baru yang perlu dieksekusi.`,
          timestamp,
          toolCalls: [
            {
              name: "get_active_bmkg_warning",
              args: {
                province: context.location.province,
                city: context.location.city,
                district: context.location.district,
              },
              status: "completed",
            },
          ],
        };
      } else if (matchResult.status === "unavailable") {
        return {
          id,
          sender: "assistant",
          text: `⚠️ Maaf, layanan data BMKG CAP sementara tidak dapat dihubungi.\n\nSesuai prinsip **Responsible AI SIAGA**, saya tidak akan mengarang prakiraan cuaca mandiri. Silakan coba sesaat lagi atau cek website resmi bmkg.go.id.`,
          timestamp,
        };
      } else {
        return {
          id,
          sender: "assistant",
          text: `✓ Tidak ditemukan peringatan dini aktif BMKG yang mencakup wilayah **Kec. ${context.location.district}, ${context.location.city}** pada data terkini yang diperiksa.\n\nSistem tidak menyatakan cuaca pasti 100% aman, namun saat ini tidak ada status cuaca ekstrem resmi dari BMKG.`,
          timestamp,
        };
      }
    }

    // 2. User selects or specifies a role
    if (text.startsWith("role:") || text.includes("panitia") || text.includes("operasional") || text.includes("security")) {
      let role: UserRole = "campus_operations";
      if (text.includes("event") || text.includes("panitia")) role = "event_organizer";
      else if (text.includes("security")) role = "campus_security";
      else if (text.includes("sekolah")) role = "school_operations";

      const isOutdoor = text.includes("event") || text.includes("outdoor") || Boolean(context.isOutdoorEvent);

      const plan = buildRoleActionPlan({
        warning: matchResult,
        role,
        context: { outdoor_event: isOutdoor, participants: 150 },
      });

      const roleTitles: Record<UserRole, string> = {
        campus_operations: "Operasional Kampus",
        campus_security: "Keamanan / Security Kampus",
        event_organizer: "Panitia Event Lapangan",
        school_operations: "Operasional Sekolah",
        factory_operations: "Operasional Pabrik",
        warehouse_operations: "Operasional Gudang",
        logistics: "Logistik & Transportasi",
        community_leader: "Pengurus RT/RW",
      };

      return {
        id,
        sender: "assistant",
        text: `Baik, saya telah memproses konteks peran **${roleTitles[role]}** dan menyelaraskannya dengan SOP mitigasi bencana kampus yang terverifikasi.\n\n📋 **Ringkasan Rencana Tindakan:**\n* **Prioritas Tinggi:** ${plan.priorityActions.length} tindakan segera (misal: pengamanan saluran, sterilisasi area terbuka).\n* **Pencegahan Fasilitas:** ${plan.recommendedActions.length} tindakan pendukung.\n* **Pengawasan:** ${plan.monitoring.length} item monitoring berkala.\n\nApakah Anda ingin mengirimkan broadcast peringatan ini kepada tim lapangan dan penanggung jawab teknis?`,
        timestamp,
        toolCalls: [
          {
            name: "build_role_action_plan",
            args: {
              role,
              warning_id: matchResult.warning?.id,
              outdoor_event: isOutdoor,
            },
            status: "completed",
          },
        ],
        actionPlanPreview: plan,
        quickReplies: [
          { label: "Kirim Pemberitahuan Tim", payload: "action:notify_team" },
          { label: "Lihat Rincian SOP", payload: "action:view_sop" },
        ],
      };
    }

    // 3. User requests team notification
    if (text.includes("kirim") || text.includes("notify") || text.includes("notifikasi")) {
      return {
        id,
        sender: "assistant",
        text: `🛡️ **Gerbang Konfirmasi Manusia (Responsible AI Gate):**\n\nSIAGA tidak akan mengirimkan pemberitahuan eksternal tanpa persetujuan eksplisit Anda.\n\n* **Penerima:** Petugas Keamanan, Koordinator Sarpras, PIC Acara\n* **Kanal:** Email & Task Dispatch\n* **Ringkasan Pesan:** Peringatan BMKG aktif hingga jam berakhir.\n\nApakah Anda menyetujui pengiriman pesan darurat ini sekarang?`,
        timestamp,
        quickReplies: [
          { label: "✓ Ya, Konfirmasi & Kirim", payload: "confirm:yes" },
          { label: "✕ Batalkan", payload: "confirm:no" },
        ],
      };
    }

    // 4. User confirms or cancels
    if (text.includes("confirm:yes") || text.includes("ya") || text.includes("setuju")) {
      return {
        id,
        sender: "assistant",
        text: `✓ **Pemberitahuan Berhasil Dikirim!**\n\nTool \`notify_confirmed_team\` telah dieksekusi setelah menerima otorisasi resmi pengguna:\n* Notifikasi terkirim ke 2 kanal tim operasional.\n* Log audit tersimpan dengan stempel waktu resmi.\n* Status monitoring BMKG tetap aktif hingga peringatan kedaluwarsa.\n\nAda hal lain yang dapat saya bantu koordinasikan?`,
        timestamp,
        toolCalls: [
          {
            name: "notify_confirmed_team",
            args: {
              confirmed: true,
              channel: "mock",
              recipients: ["security@pens.ac.id", "sarpras@pens.ac.id"],
            },
            status: "completed",
          },
        ],
      };
    }

    if (text.includes("confirm:no") || text.includes("batal") || text.includes("tidak")) {
      return {
        id,
        sender: "assistant",
        text: `Tindakan pengiriman dibatalkan. Tidak ada pesan atau notifikasi eksternal yang dikirimkan. Rencana tindakan tetap tersimpan di dashboard untuk tinjauan internal Anda.`,
        timestamp,
      };
    }

    // Default fallback guidance
    return {
      id,
      sender: "assistant",
      text: `Saya adalah **SIAGA Copilot** (terintegrasi dengan IBM Bob & Langflow). Saya dapat membantu Anda memeriksa peringatan dini cuaca resmi BMKG, mencocokkannya dengan wilayah Anda, serta menyusun rencana tindakan tanggap darurat berbasis SOP.\n\nSilakan tanyakan: *"Apakah ada peringatan cuaca untuk kampus saya?"* atau pilih tombol pintas di bawah.`,
      timestamp,
      quickReplies: [
        { label: "Cek Peringatan Kampus PENS", payload: "Cek peringatan cuaca kampus saya" },
        { label: "Susun Action Plan Event", payload: "role:event_organizer" },
      ],
    };
  }
}
