import { NextRequest, NextResponse } from "next/server";
import { executeSuggestPriceAction } from "@/lib/mcp/tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = executeSuggestPriceAction(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/suggest error:", error);
    return NextResponse.json(
      { error: "Gagal menghasilkan rekomendasi tindakan harga", details: String(error) },
      { status: 400 }
    );
  }
}
