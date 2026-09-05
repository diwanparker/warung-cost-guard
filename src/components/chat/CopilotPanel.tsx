import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Wrench,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { ChatMessage, ChatContext } from "@/lib/agent/types";
import type { UserLocation, UserRole } from "@/types/user";

interface CopilotPanelProps {
  location: UserLocation;
  role: UserRole;
  scenario: "A" | "B" | "C" | "D" | "LIVE";
  isOutdoorEvent: boolean;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

let messageSeq = 1;
function generateMessageId(prefix: string) {
  return `${prefix}-${messageSeq++}`;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "init-1",
  sender: "assistant",
  text: `Halo! Saya **SIAGA Copilot**, asisten percakapan Anda (didukung oleh **IBM Bob** & workflow **Langflow**).\n\nSaya siap membantu Anda memeriksa peringatan resmi BMKG, mencocokkan dampak ke lokasi kampus, dan menyusun SOP kesiapsiagaan darurat.`,
  timestamp: "2026-09-05T13:00:00.000Z",
  quickReplies: [
    { label: "Cek Peringatan Kampus PENS", payload: "Cek peringatan cuaca kampus saya" },
    { label: "Susun Action Plan Event", payload: "role:event_organizer" },
    { label: "SOP Operasional Kampus", payload: "role:campus_operations" },
  ],
};

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  location,
  role,
  scenario,
  isOutdoorEvent,
  isOpen,
  onToggle,
  className = "",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: generateMessageId("user"),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const context: ChatContext = {
        location,
        role,
        scenario,
        isOutdoorEvent,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages,
          context,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, data.reply]);
      }
    } catch (err) {
      console.error("Chat send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("err"),
          sender: "system",
          text: "Gagal terhubung ke layanan Copilot. Silakan coba kembali.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl shadow-blue-500/25 active:scale-95 transition-all"
        aria-label="Buka SIAGA Copilot Chat"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        <span className="text-xs font-bold tracking-wide">IBM Bob Copilot</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 ${className}`}
      role="complementary"
      aria-label="Panel Asisten Percakapan SIAGA"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                SIAGA Copilot
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                IBM Bob + MCP
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Alur Percakapan Cerdas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="Mulai Ulang Percakapan"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="Tutup Panel"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== "user" && (
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            )}

            <div className="max-w-[85%] space-y-2">
              <div
                className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-xs font-medium"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200 dark:border-slate-700/60"
                }`}
              >
                {msg.text}
              </div>

              {/* MCP Tool Call Badge */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="space-y-1">
                  {msg.toolCalls.map((tc, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60"
                    >
                      <Wrench className="w-3 h-3" aria-hidden="true" />
                      <span>MCP Call: {tc.name}()</span>
                      <span className="text-emerald-600 font-bold">✓</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Replies */}
              {msg.quickReplies && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.quickReplies.map((qr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(qr.payload)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 transition"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px]">IBM Bob sedang memproses workflow Langflow...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan ke Bob (cth: Cek warning kampus)..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0"
            aria-label="Kirim Pesan"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
