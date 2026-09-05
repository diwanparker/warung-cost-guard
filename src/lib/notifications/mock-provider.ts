import type { NotificationProvider } from "./provider";
import type { NotificationRequest, NotificationResult } from "@/types/action";

export class MockNotificationProvider implements NotificationProvider {
  async send(request: NotificationRequest): Promise<NotificationResult> {
    const timestamp = new Date().toISOString();

    // STRICT RESPONSIBLE AI RULE: No external action without explicit human confirmation
    if (!request.confirmed) {
      return {
        success: false,
        channel: request.channel,
        recipientCount: 0,
        timestamp,
        message: "Dibatalkan: Konfirmasi otorisasi manusia tidak diberikan. Tidak ada tindakan eksternal yang dilakukan.",
      };
    }

    return {
      success: true,
      channel: request.channel,
      recipientCount: request.recipients.length,
      timestamp,
      message: `Pemberitahuan darurat berhasil dikirimkan kepada ${request.recipients.length} penerima melalui kanal ${request.channel}.`,
    };
  }
}

export const notificationProvider = new MockNotificationProvider();
