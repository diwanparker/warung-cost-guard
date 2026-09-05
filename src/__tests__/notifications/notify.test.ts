import { describe, it, expect } from "vitest";
import { MockNotificationProvider } from "@/lib/notifications/mock-provider";

describe("Notification Service & Confirmation Gate", () => {
  const provider = new MockNotificationProvider();

  it("fails and rejects dispatch when confirmed is false", async () => {
    const result = await provider.send({
      confirmed: false,
      recipients: ["security@pens.ac.id"],
      message: "Peringatan darurat cuaca",
      channel: "email",
    });

    expect(result.success).toBe(false);
    expect(result.recipientCount).toBe(0);
    expect(result.message).toContain("Dibatalkan: Konfirmasi otorisasi");
  });

  it("succeeds and delivers notification when confirmed is true", async () => {
    const result = await provider.send({
      confirmed: true,
      recipients: ["security@pens.ac.id", "sarpras@pens.ac.id"],
      message: "Peringatan dini aktif hingga 16:00 WIB",
      channel: "email",
    });

    expect(result.success).toBe(true);
    expect(result.recipientCount).toBe(2);
    expect(result.channel).toBe("email");
    expect(result.message).toContain("berhasil");
  });
});
