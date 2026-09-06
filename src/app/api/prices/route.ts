import { NextRequest, NextResponse } from "next/server";
import { executeGetMarketPrices } from "@/lib/mcp/tools";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commodity = searchParams.get("commodity") || "ayam_ras";
    const city = searchParams.get("city") || "Surabaya";
    const date = searchParams.get("date") || undefined;

    const data = await executeGetMarketPrices({ commodity, city, date });
    return NextResponse.json(data);
  } catch (error) {
    console.error("API /api/prices error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data harga pasar", details: String(error) },
      { status: 400 }
    );
  }
}
