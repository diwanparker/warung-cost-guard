import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Bot, User, Wrench } from "lucide-react";
import type { ChatMessage } from "@/types/agent";
import type { BusinessRole } from "@/types/user";

interface CopilotPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  role: BusinessRole;
  city: string;
  activeCommodityId: string;
  purchasePrice?: number;
  transportCost?: number;
  wastePct?: number;
  sellingPrice?: number;
  scenarioId?: "A" | "B" | "C";
  initialPrompt?: string;
}

export function CopilotPanel({
  isOpen,
  onToggle,
  role,
  city,
  activeCommodityId,
  purchasePrice,
  transportCost,
  wastePct,
  sellingPrice,
  scenarioId,
  initialPrompt,
}: CopilotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo! Saya **Warung Cost Guard Copilot**. Sebelum memutuskan menaikkan harga atau mengorbankan margin, mari hitung dulu biaya nyata (modal + transport + susut), bandingkan dengan harga pasar resmi Surabaya, dan temukan tindakan paling rasional.",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages,
          context: {
            role,
            city,
            activeCommodityId,
            purchasePrice,
            transportCost,
            wastePct,
            sellingPrice,
            scenarioId,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Maaf, terjadi kendala saat memproses analisis. Silakan coba lagi sebentar lagi.",
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Gagal terhubung ke server Copilot. Periksa koneksi Anda.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Ayam dari 32rb jadi 36.5rb, jual 45rb margin saya aman?",
    "Minyakita modal 14.8rb mau jual 16.5rb boleh?",
    "Cabai rawit kulakan 60rb susut 8%, apa solusinya?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">IBM Bob Copilot</h3>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                9router / Langflow
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Analisis Margin & Referensi Pasar SP2KP/PIHPS
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
              {msg.role === "user" ? (
                <>
                  <span>Pedagang</span>
                  <User className="w-3 h-3" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-emerald-600" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Bob Copilot</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            {/* Tool Calls badge if any */}
            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div className="mb-1.5 flex flex-wrap gap-1">
                {msg.toolCalls.map((tc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <Wrench className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{tc.toolName}()</span>
                  </span>
                ))}
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-line leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-br-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200 dark:border-slate-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
              Bob sedang mengeksekusi tool & menghitung...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="text-[10px] text-slate-400 font-semibold mb-1.5">Pertanyaan Cepat:</div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Tanyakan margin, modal, atau tindakan harga..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-emerald-500"
        />
        <button
          type="button"
          disabled={loading || !input.trim()}
          onClick={() => handleSend()}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition shrink-0"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
