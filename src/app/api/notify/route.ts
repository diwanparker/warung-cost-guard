import { NextRequest, NextResponse } from "next/server";
import { executeNotifySupplier } from "@/lib/mcp/tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.confirmed) {
      return NextResponse.json(
        {
          sent: false,
          error: "HUMAN_CONFIRMATION_REQUIRED",
          message: "Aksi eksternal dibatalkan: Diperlukan konfirmasi eksplisit dari pengguna.",
        },
        { status: 400 }
      );
    }

    const result = await executeNotifySupplier(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/notify error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim notifikasi", details: String(error) },
      { status: 500 }
    );
  }
}
