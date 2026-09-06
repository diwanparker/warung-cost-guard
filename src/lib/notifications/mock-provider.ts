import type { NotificationProvider } from "./provider";
import type { SupplierNotificationRequest, SupplierNotificationResult } from "@/types/supplier";
import { getSupplierById } from "@/data/demo/suppliers";

export class MockNotificationProvider implements NotificationProvider {
  async send(request: SupplierNotificationRequest): Promise<SupplierNotificationResult> {
    // RESPONSIBLE AI HARD GATE:
    if (!request.confirmed) {
      return {
        sent: false,
        channel: request.channel || "mock",
        timestamp: new Date().toISOString(),
        message: "Pengiriman dibatalkan: Konfirmasi otorisasi pengguna manusia tidak diberikan.",
        error: "HUMAN_CONFIRMATION_REQUIRED",
      };
    }

    const supplier = getSupplierById(request.supplier_id);
    const channel = request.channel || "whatsapp";
    const recipient = supplier ? `${supplier.contactPerson} (${supplier.phone})` : request.supplier_id;

    console.log(`[NOTIF-DISPATCH] Sent via ${channel} to ${recipient}: "${request.message}"`);

    return {
      sent: true,
      channel,
      timestamp: new Date().toISOString(),
      message: `Pesan negosiasi berhasil dikirimkan ke ${recipient} via ${channel.toUpperCase()}.`,
    };
  }
}

export const notificationProvider = new MockNotificationProvider();
