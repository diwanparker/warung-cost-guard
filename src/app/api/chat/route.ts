import { NextRequest, NextResponse } from "next/server";
import { MockAgentProvider } from "@/lib/agent/mock-provider";
import type { ChatMessage, ChatContext } from "@/lib/agent/types";

const agent = new MockAgentProvider();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], context } = body as {
      message: string;
      history?: ChatMessage[];
      context: ChatContext;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const reply = await agent.sendMessage(message, history, context);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesan percakapan" },
      { status: 500 }
    );
  }
}
