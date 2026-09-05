import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notificationProvider } from "@/lib/notifications/mock-provider";

const notifySchema = z.object({
  confirmed: z.boolean(),
  recipients: z.array(z.string()).min(1),
  message: z.string().min(3),
  channel: z.enum(["email", "whatsapp", "task", "mock"]).default("email"),
  actionPlanId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = notifySchema.parse(body);

    // Strict safety check:
    if (!parsed.confirmed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Aksi ditolak: Pengiriman notifikasi eksternal memerlukan konfirmasi eksplisit dari pengguna manusia.",
        },
        { status: 403 }
      );
    }

    const result = await notificationProvider.send(parsed);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Notify API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pengiriman notifikasi." },
      { status: 400 }
    );
  }
}
