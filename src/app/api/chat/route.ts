import { NextRequest, NextResponse } from "next/server";
import { defaultAgentProvider } from "@/lib/agent/provider";
import type { ChatMessage, ChatContext } from "@/types/agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], context = {} } = body as {
      message: string;
      history?: ChatMessage[];
      context?: ChatContext;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const reply = await defaultAgentProvider.sendMessage(message, history, context);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesan percakapan", details: String(error) },
      { status: 500 }
    );
  }
}
