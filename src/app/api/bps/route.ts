import { NextRequest, NextResponse } from "next/server";
import { fetchBpsFoodInflation } from "@/lib/bps/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get("region") || "3500";
    const data = await fetchBpsFoodInflation(region);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API /api/bps error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data indikator BPS", details: String(error) },
      { status: 500 }
    );
  }
}
