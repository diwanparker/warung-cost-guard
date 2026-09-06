import { NextRequest, NextResponse } from "next/server";
import { executeCalculateMargin } from "@/lib/mcp/tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = executeCalculateMargin(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/margin error:", error);
    return NextResponse.json(
      { error: "Gagal menghitung margin", details: String(error) },
      { status: 400 }
    );
  }
}
